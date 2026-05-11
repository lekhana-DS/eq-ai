import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!upstashUrl) throw new Error("UPSTASH_REDIS_REST_URL is missing");
if (!upstashToken) throw new Error("UPSTASH_REDIS_REST_TOKEN is missing");
if (!upstashUrl.startsWith("https://")) throw new Error("UPSTASH_REDIS_REST_URL must start with https://");

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: upstashUrl,
    token: upstashToken,
  }),
  limiter: Ratelimit.fixedWindow(5, "60 s"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Slow down." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, company, role, teamSize, username_verification } = body;

    if (username_verification) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email field is mandatory" },
        { status: 400 }
      );
    }

    const teamSizeNum = Number(teamSize) || null;

    const { error: dbError } = await supabase.from("leads").insert([
      {
        email,
        company_name: company || null,
        role: role || null,
        team_size: teamSizeNum,
      },
    ]);

    if (dbError && dbError.code !== "23505") {
      throw dbError;
    }

    if (resend) {
      const result = await resend.emails.send({
        from: "Credex Audits <audits@yourdomain.com>",
        to: email,
        subject:
          teamSizeNum && teamSizeNum > 50
            ? "🚀 Your Infrastructure Audit Report - High Savings Priority"
            : "📊 Your Infrastructure Audit Report Confirmation",
        html: `
          <div style="font-family:sans-serif;padding:20px;color:#333;">
            <h2>Infrastructure Audit Confirmed</h2>
            <p>Thank you for initiating your automated infrastructure audit stack profile analysis.</p>
            <p><strong>Captured Parameters:</strong></p>
            <ul>
              <li>Company: ${company || "Not specified"}</li>
              <li>Team Size: ${teamSizeNum || "Not specified"}</li>
            </ul>
            ${
              teamSizeNum && teamSizeNum > 50
                ? "<p><strong>Note:</strong> Due to your enterprise configuration scale, a Credex engineering specialist will reach out within 24 hours to deliver targeted system recommendations.</p>"
                : ""
            }
            <p>Best regards,<br/>The Credex Engineering Team</p>
          </div>
        `,
      });

      console.log("Resend send result:", result);
    }

    return NextResponse.json(
      { success: true, message: "Form logged successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Capture lead error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}