// app/api/summary/route.ts
import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  let teamSize = 0;
  let useCase = 'General Use';
  let currentSpend = 0;
  let monthlySavings = 0;
  let topOverspendTool = 'AI Stack';

  try {
    const body = await request.json();
    
    teamSize = body?.auditData?.teamSize || 0;
    useCase = body?.auditData?.useCase || 'General Use';
    currentSpend = body?.results?.currentSpend || 0;
    monthlySavings = body?.results?.monthlySavings || 0;
    topOverspendTool = body?.results?.topOverspendTool || 'AI Stack';

    const fallbackTemplate = `Based on your audited profile with ${teamSize} active seats, your current $${currentSpend}/mo spend allocation reveals optimization opportunities. By restructuring plan parameters on your toolstack, your organization can recapture approximately $${monthlySavings}/mo in baseline infrastructure capital.`;

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ summary: fallbackTemplate });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `Write an executive infrastructure audit summary paragraph for a startup founder:
          - Profile: Team size ${teamSize}, Use Case: ${useCase}
          - Metrics: Spending $${currentSpend}/mo, savings potential: $${monthlySavings}/mo.
          - Primary Component Stack: ${topOverspendTool}
          
          Constraints: Maximum 100 words. Maintain a professional, data-driven financial tone. Highlight the structural overspend leak.`
        }
      ]
    });

    const block = response.content[0];
    const extractedText = block && block.type === 'text' ? block.text : '';

    return NextResponse.json({ summary: extractedText || fallbackTemplate });

  } catch (error) {
    console.error("Critical API Execution Interruption, generating safe fallback summary data.");
    return NextResponse.json({ 
      summary: `Based on your audited profile with ${teamSize} active seats, your current $${currentSpend}/mo spend allocation reveals optimization opportunities. By restructuring plan parameters on your toolstack, your organization can recapture approximately $${monthlySavings}/mo in baseline infrastructure capital.`
    });
  }
}