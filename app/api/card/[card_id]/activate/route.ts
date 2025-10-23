import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ card_id: string }> }
) {
  try {
    const { card_id } = await params;

    if (!card_id) {
      return NextResponse.json(
        { error: 'Card ID is required' },
        { status: 400 }
      );
    }

    console.log(`[Activate API] Activating card: ${card_id}`);

    // Forward activation request to mujicard.com API
    const response = await fetch(
      `https://mujicard.com/api/card/activate/${card_id}`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'Referer': 'https://mujicard.com/activate',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    console.log(`[Activate API] Response status: ${response.status}`);
    console.log(`[Activate API] Response data:`, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Activate API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to activate card' },
      { status: 500 }
    );
  }
}

