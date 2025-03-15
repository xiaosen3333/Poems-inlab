import { NextResponse } from 'next/server';
import type { Message } from '@/lib/utils/api';

const API_KEY = 'sk-c1eaf8268c8d4911ae3b9c7ce07f40d8060baekitqp0e7qx';
const API_URL = 'https://ai-gateway.vei.volces.com/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      return NextResponse.json({ 
        error: `API error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}