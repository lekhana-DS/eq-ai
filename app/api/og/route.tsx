import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = searchParams.get('savings') || '0';

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e3a8a',
        color: 'white', padding: '40px', fontFamily: 'sans-serif'
      }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 20 }}>EQ AI Audit Results</div>
        <div style={{ fontSize: 80, fontWeight: 'black' }}>Saved: ${savings}/yr</div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.8 }}>Optimize your AI infrastructure today.</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
