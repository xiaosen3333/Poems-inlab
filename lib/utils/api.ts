// API utilities for interacting with Deepseek AI model
import { ChatMessage, predefinedQuestions as defaultPredefinedQuestions } from "@/lib/config/appConfig";

// Use default predefined questions to maintain SSR compatibility
const predefinedQuestions = defaultPredefinedQuestions;

// AI API configuration - using the same server as image generation
const GENERATION_SERVER = 'https://cvgch5k7v38s73a8h9vg-8000.agent.damodel.com';
const API_URL = `${GENERATION_SERVER}/chat`;
export const MODEL = 'deepseek-chat';
export const TEMPERATURE = 0.7;

export type Message = ChatMessage;

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
    // Direct call to the AI service using the same backend as image generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: MODEL,
        temperature: TEMPERATURE
      }),
      // Same CORS settings as image generation
      mode: 'cors',
      credentials: 'omit',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    // Assuming the response format is similar to the official API
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message?.content || 'Sorry, I couldn\'t generate a response.';
    } else if (data.content) {
      // Alternative response format
      return data.content;
    } else {
      console.error('Unexpected response format:', data);
      return 'Sorry, received an unexpected response format.';
    }
  } catch (error) {
    console.error('Error chatting with AI:', error);
    
    // More specific error messages
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'Sorry, the AI service took too long to respond. Please try again.';
    }
    
    return 'Sorry, there was an error communicating with the AI service.';
  }
}

// Export predefined questions for poetry analysis
export { predefinedQuestions };