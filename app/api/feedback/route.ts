import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
const OPTIONS = ['Incredible', 'Good', 'Mixed', 'Not good'];

/** Anonymous relay: keeps ONLY { experience, feedback }. Reads no IP/UA/cookies, adds no timestamp, logs nothing. */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (typeof b.website === 'string' && b.website) return NextResponse.json({ ok: true }); // honeypot
  const experience = String(b.experience ?? ''); const feedback = String(b.feedback ?? '').trim().slice(0, 2000);
  if (!OPTIONS.includes(experience) || !feedback) return NextResponse.json({ ok: false }, { status: 422 });
  const hook = process.env.FEEDBACK_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  try {
    const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `[${experience}] ${feedback}`, experience, feedback }) });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
  } catch { return NextResponse.json({ ok: false }, { status: 502 }); }
}
