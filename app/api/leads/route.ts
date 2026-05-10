import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '60 s'),
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Slow down.' }, { status: 429 });
    }

    const body = await request.json();
    const { email, companyName, role, teamSize, honeypot } = body;

    // 2. Honeypot Abuse Detection
    if (honeypot) {
      return NextResponse.json({ message: 'Audit processed successfully' }, { status: 200 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email field is mandatory' }, { status: 400 });
    }

    // 3. Store lead details inside Supabase Database
    const { error: dbError } = await supabase.from('leads').insert([
      {
        email,
        company_name: companyName,
        role,
        team_size: teamSize ? parseInt(teamSize) : null,
      },
    ]);

    if (dbError && dbError.code !== '23505') { // Bypass error blocks for existing duplicate emails
      throw dbError;
    }

    // 4. Send Transactional Confirmation Email
    const emailSubject = parseInt(teamSize) > 50 
      ? '🚀 Your Infrastructure Audit Report - High Savings Priority'
      : '📊 Your Infrastructure Audit Report Confirmation';

    await resend.emails.send({
      from: 'Credex Audits <audits@yourdomain.com>',
      to: email,
      subject: emailSubject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Infrastructure Audit Confirmed</h2>
          <p>Thank you for initiating your automated infrastructure audit stack profile analysis.</p>
          <p><strong>Captured Parameters:</strong></p>
          <ul>
            <li>Company: ${companyName || 'Not specified'}</li>
            <li>Team Size: ${teamSize || 'Not specified'}</li>
          </ul>
          ${parseInt(teamSize) > 50 ? '<p><strong>Note:</strong> Due to your enterprise configuration scale, a Credex engineering specialist will reach out within 24 hours to deliver targeted system recommendations.</p>' : ''}
          <p>Best regards,<br/>The Credex Engineering Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Form logged successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
