import { NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize the client. This safely loads your secret token on Vercel/local env
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: Request) {
  let results: { monthlySavings?: number; currentSpend?: number; actionsList?: string[] } = {};

  try {
    const body = await request.json();
    const { auditData, results: bodyResults } = body;
    results = bodyResults || {};

    // Hardcoded static fallback layout if Anthropic fails or rates limits hit
    const fallbackSummary = `Based on your monthly spend of $${results.currentSpend || 0}, you can save $${results.monthlySavings || 0} by optimizing your current plan configurations. Downgrading or switching plans provides your fastest route to capital efficiency.`;

    // Strict validation: if key is missing, immediately slide into fallback mode gently
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("Missing ANTHROPIC_API_KEY. Using fallback template.");
      return NextResponse.json({ summary: fallbackSummary });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `Write a ~100-word executive financial audit summary paragraph for a startup founder based on this dataset:
          - Context: Team size ${auditData.teamSize}, Primary Use Case: ${auditData.useCase}
          - Metrics: Current spend $${results.currentSpend}/mo, potential calculated savings $${results.monthlySavings}/mo.
          - Recommended Action Items: ${results.actionsList?.join(', ') || 'Plan optimization'}
          
          Constraints: Maximum 100 words total. Tone must be highly professional, analytical, and objective. Point out the single largest structural overspend leak.`
        }
      ]
    });

    const aiText = response.content[0]?.type === 'text' ? response.content[0].text : fallbackSummary;
    return NextResponse.json({ summary: aiText || fallbackSummary });

  } catch (error) {
    console.error("API Call error during processing, executing automated fallback:", error);
    // Return a 200 status with fallback text so your user interface layout doesn't crash
    return NextResponse.json({ 
      summary: `Our automated engine suggests checking your primary software tiers. Your custom optimization overview indicates an immediate monthly saving capacity of $${results?.monthlySavings || 0}.` 
    });
  }
}

