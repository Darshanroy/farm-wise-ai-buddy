import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { Message, ChatState } from '@/types/chat'; // Assuming these types are defined elsewhere
import { sampleQuestions } from '@/data/sampleQuestions'; // Assuming this data exists
import QuestionSuggestion from './QuestionSuggestion'; // Assuming this component exists
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

// --- Define Backend API URL ---
// Use environment variable in a real app: process.env.REACT_APP_API_URL
const API_URL = 'http://localhost:5000/api/chat'; // Or your backend server address

const ChatInterface: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [{
      id: 'welcome',
      content: "Hello! I'm your FarmWise AI assistant. How can I help with your farming questions today?",
      sender: 'ai',
      timestamp: new Date(),
    }],
    isLoading: false,
  });

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // --- Function to get AI response from Backend ---
  const getAIResponse = async (userQuestion: string) => {
    setChatState(prev => ({
      ...prev,
      isLoading: true,
    }));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userQuestion }),
      });

      if (!response.ok) {
        // Handle HTTP errors (like 500 Internal Server Error from backend)
        const errorData = await response.json().catch(() => ({})); // Try to parse error body
        console.error("API Error Response:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data.response) {
        setChatState(prev => ({
          messages: [
            ...prev.messages,
            {
              id: uuidv4(),
              content: data.response, // Use response from backend
              sender: 'ai',
              timestamp: new Date(),
            },
          ],
          isLoading: false,
        }));
      } else {
        // Handle cases where backend response format is unexpected
         throw new Error("Invalid response format from API");
      }

    } catch (error) {
      console.error('Error fetching AI response:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
      }));
      // Add an error message to the chat or use toast
       setChatState(prev => ({
        messages: [
          ...prev.messages,
          {
            id: uuidv4(),
            content: `Sorry, I encountered an error trying to respond. Please try again. ${error instanceof Error ? `(${error.message})` : ''}`,
            sender: 'ai',
            timestamp: new Date(),
          },
        ],
        isLoading: false,
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatState.isLoading) return; // Prevent sending while loading

    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately for better UX
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Get AI response from backend
    getAIResponse(inputMessage); // Pass the original input message

    // Clear input field *after* initiating the API call
    setInputMessage('');
  };

  // Handle pressing Enter to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle selecting a suggested question
  const handleSuggestedQuestion = (question: string) => {
    // Add user message for the suggestion
    const userMessage: Message = {
        id: uuidv4(),
        content: question,
        sender: 'user',
        timestamp: new Date(),
    };

    setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true, // Set loading true immediately
    }));

    setInputMessage(''); // Clear input if needed, though it wasn't used here
    getAIResponse(question); // Call backend with the suggested question
  };


  return (
    <div className="flex flex-col rounded-xl border border-farm-green-500 bg-white/40 backdrop-blur-sm shadow-lg overflow-hidden h-[650px] max-h-[80vh]">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 chat-container">
        <div className="space-y-4">
          {chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Added basic styling differentiation */}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-farm-green-500 text-white farmer-message' // Example user style
                    : 'bg-gray-100 text-farm-brown-700 ai-message'   // Example AI style
                }`}
              >
                {/* Render content safely - consider markdown rendering if needed */}
                {message.content}
              </div>
            </div>
          ))}

          {chatState.isLoading && (
            <div className="flex justify-start">
              <div className="ai-message flex items-center space-x-2 bg-gray-100 text-farm-brown-700 p-3 rounded-lg text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-farm-green-500" />
                <span>FarmWise AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {/* Conditionally render suggestions only if not loading and maybe if message list is short? */}
      {!chatState.isLoading && (
          <div className="p-3 bg-farm-green-100/50 border-t border-farm-green-500/30">
          <h3 className="text-xs font-medium text-farm-brown-600 mb-2">
            SUGGESTED QUESTIONS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleQuestions.slice(0, 4).map((q) => (
              <QuestionSuggestion
                key={q.id}
                question={q} // Pass the whole question object if needed by component
                onSelect={() => handleSuggestedQuestion(q.text)} // Ensure you pass the string
              />
            ))}
          </div>
        </div>
      )}


      {/* Input Area */}
      <div className="p-3 border-t border-farm-green-500/30 bg-white">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            id="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crops, pests, soil, weather..."
            className="flex-1 border-farm-green-500/40 focus-visible:ring-farm-green-500"
            disabled={chatState.isLoading} // Disable input while loading
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || chatState.isLoading}
            className="bg-farm-green-500 hover:bg-farm-green-700 text-white disabled:opacity-50"
          >
            {chatState.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

// --- Make sure your types are defined somewhere, e.g., src/types/chat.ts ---
/*
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface SampleQuestion {
 id: string;
 text: string;
}
*/

// --- Make sure your QuestionSuggestion component exists ---
/*
import React from 'react';
import { Button } from '@/components/ui/button';
import { SampleQuestion } from '@/types/chat';

interface QuestionSuggestionProps {
  question: SampleQuestion;
  onSelect: (questionText: string) => void;
}

const QuestionSuggestion: React.FC<QuestionSuggestionProps> = ({ question, onSelect }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="text-left justify-start h-auto whitespace-normal text-xs border-farm-green-500/50 text-farm-brown-600 hover:bg-farm-green-500/10"
      onClick={() => onSelect(question.text)}
    >
      {question.text}
    </Button>
  );
};

export default QuestionSuggestion;
*/