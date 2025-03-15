// API utilities for interacting with Deepseek AI model

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: Message[];
  temperature?: number;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatWithAI(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Error chatting with AI:', error);
    return 'Sorry, there was an error communicating with the AI service.';
  }
}

// Predefined questions for poetry analysis
export const predefinedQuestions = [
  { 
    id: 'background',
    label: 'Background',
    icon: 'ⓘ',
    question: 'Please explain the historical background of this poem and its author.'
  },
  { 
    id: 'techniques',
    label: 'Techniques',
    icon: 'T',
    question: 'What poetic techniques are used in this poem?'
  },
  { 
    id: 'theme',
    label: 'Theme',
    icon: '-',
    question: 'What are the main themes of this poem?'
  },
  { 
    id: 'more',
    label: 'More',
    icon: '+',
    question: 'Please provide a deeper analysis of the imagery in this poem.'
  }
];