import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_SFShZaJT...');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userEmail = body.email || 'Anonymous User';
    const audit = body.auditDetails || {};

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'lekhanads2003@gmail.com', // Sandbox restriction email target
      subject: `EQ AI Audit Request Received: ${userEmail}`,
      html: `
        <h2>New Infrastructure Audit Collected</h2>
        <p><strong>Lead Email:</strong> ${userEmail}</p>
        <hr />
        <h3>Audit Configuration:</h3>
        <ul>
          <li><strong>Configured Tool:</strong> ${audit.tool || 'N/A'}</li>
          <li><strong>Plan Tier:</strong> ${audit.plan || 'N/A'}</li>
          <li><strong>Monthly Outflow ($):</strong> ${audit.monthlySpend || 0}</li>
          <li><strong>Active Seat Allocation:</strong> ${audit.users || 0}</li>
          <li><strong>Core Environment Scope:</strong> ${audit.useCase || 'N/A'}</li>
        </ul>
        <hr />
        <h3>Financial Optimization Projection:</h3>
        <p><strong>Projected Annual Budget Offset:</strong> $${audit.annualSavings || 0}</p>
        <p><strong>Actionable Vector Strategy:</strong> ${audit.strategy || 'N/A'}</p>
      `,
    });

    if (error) return Response.json({ error }, { status: 400 });
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
