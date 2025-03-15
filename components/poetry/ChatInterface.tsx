"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { chatWithAI, predefinedQuestions, type Message } from "@/lib/utils/api";
import { PoemData } from "@/lib/data/poems";

interface ChatInterfaceProps {
  poem: PoemData;
}

export function ChatInterface({ poem }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize system message with poem context
  useEffect(() => {
    const systemMessage: Message = {
      role: "system",
      content: `You are a helpful poetry expert. You're discussing the poem "${poem.title.original} (${poem.title.translated})" by ${poem.author.name} from the ${poem.author.dynasty} dynasty. 
      
Original text:
${poem.verses.map(v => v.original).join('\n')}

English translation:
${poem.verses.map(v => v.translated).join('\n')}

Background: ${poem.background || 'No background information available.'}

Please provide insightful, accurate, and educational responses about this poem. Keep your answers concise but informative.`
    };
    
    setMessages([systemMessage]);
  }, [poem]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Filter out system messages for API call
      const visibleMessages = messages
        .filter(msg => msg.role !== "system")
        .concat(userMessage);
      
      // Include system message at the beginning
      const apiMessages = [
        messages[0], // System message
        ...visibleMessages
      ];
      
      const response = await chatWithAI(apiMessages);
      
      const assistantMessage: Message = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm sm:text-base mb-3 sm:mb-4">
        What can I help you with?
      </div>
      
      <div className="mb-6 sm:mb-8 w-full flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.slice(1).map((message, index) => (
            message.role === "user" ? (
              <div 
                key={index} 
                className="bg-purple-100 ml-auto p-3 sm:p-4 rounded-xl mb-4 sm:mb-5 text-xs sm:text-sm"
                style={{ 
                  maxWidth: Math.min(Math.max(message.content.length * 12, 150), 340) + 'px',
                  wordBreak: 'break-word'
                }}
              >
                {message.content}
              </div>
            ) : (
              <div key={index} className="space-y-3 sm:space-y-4 text-xs sm:text-sm mb-6">
                {message.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )
          ))}
          {isLoading && (
            <div className="flex space-x-2 mb-4">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-2 sm:mb-3 w-full">
        {predefinedQuestions.map(q => (
          <Button
            key={q.id}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-600 border-gray-200 rounded-full px-2 py-1 text-xs shadow h-7"
            onClick={() => handlePredefinedQuestion(q.question)}
            disabled={isLoading}
          >
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full flex items-center justify-center">
                {q.icon}
              </span>
              {q.label}
            </span>
          </Button>
        ))}
      </div>

      <div className="w-full max-w-lg mx-auto mt-auto mb-2">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type Your Query Here"
            className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-200 rounded-full focus:outline-none text-xs sm:text-sm shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(inputValue);
                e.preventDefault();
              }
            }}
            disabled={isLoading}
          />
          <button 
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${
              isLoading ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'
            } rounded-full p-1.5`}
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 20V4M12 4L4 12M12 4L20 12"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}