
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { Message, ChatState } from '@/types/chat';
import { sampleQuestions } from '@/data/sampleQuestions';
import QuestionSuggestion from './QuestionSuggestion';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

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
  
  // Function to handle AI response (simulated)
  const simulateAIResponse = (userQuestion: string) => {
    setChatState(prev => ({
      ...prev,
      isLoading: true,
    }));
    
    // Simulate AI thinking time
    setTimeout(() => {
      // Generate a contextual response based on the question
      let response = '';
      if (userQuestion.toLowerCase().includes('weather')) {
        response = "Weather conditions are critical for farming success. Make sure to check local forecasts regularly and plan your activities accordingly. For specific weather-related questions, I'd need to know your location and the crop you're concerned about.";
      } else if (userQuestion.toLowerCase().includes('pest') || userQuestion.toLowerCase().includes('aphid')) {
        response = "For pest management, I recommend integrated pest management (IPM) approaches. For aphids specifically, you can try neem oil spray, introducing beneficial insects like ladybugs, or a mild soap spray solution. Monitor your plants regularly to catch infestations early.";
      } else if (userQuestion.toLowerCase().includes('soil') || userQuestion.toLowerCase().includes('drainage')) {
        response = "Improving soil health is fundamental to successful farming. For better drainage, consider adding organic matter, implementing cover crops, and possibly installing drainage systems in severely affected areas. Soil tests can help identify specific improvements needed for your land.";
      } else if (userQuestion.toLowerCase().includes('sandy soil')) {
        response = "Sandy soils work well for root vegetables like carrots and potatoes, as well as crops like melons, cucumbers, and strawberries. They warm up quickly in spring but drain water rapidly, so water-retention strategies like adding compost and mulching are important.";
      } else if (userQuestion.toLowerCase().includes('water') || userQuestion.toLowerCase().includes('irrigation')) {
        response = "Proper irrigation is crucial for crop success. Most plants need about 1-1.5 inches of water per week, either from rainfall or irrigation. Morning watering is generally best to reduce evaporation and fungal disease risk. For specific crops like blueberries, they typically need consistent moisture but not soggy conditions.";
      } else if (userQuestion.toLowerCase().includes('plant') || userQuestion.toLowerCase().includes('wheat') || userQuestion.toLowerCase().includes('midwest')) {
        response = "For wheat in the Midwest, the ideal planting time is typically September to early October for winter wheat, allowing establishment before winter dormancy. Spring wheat is usually planted in April to May when soil temperatures reach about 40°F. Always adjust based on your specific location and local weather patterns.";
      } else {
        response = "That's a great farming question! To give you the most accurate advice, I would need to consider your specific location, climate conditions, soil type, and farming resources. Could you provide a bit more context so I can give you tailored guidance?";
      }
      
      setChatState(prev => ({
        messages: [
          ...prev.messages,
          {
            id: uuidv4(),
            content: response,
            sender: 'ai',
            timestamp: new Date(),
          },
        ],
        isLoading: false,
      }));
    }, 1500);
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    
    // Clear input field
    setInputMessage('');
    
    // Get AI response
    simulateAIResponse(inputMessage);
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
    setInputMessage(question);
    
    // Focus the input
    document.getElementById('chat-input')?.focus();
    
    // Optional: automatically send the question
    const userMessage: Message = {
      id: uuidv4(),
      content: question,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    
    setInputMessage('');
    simulateAIResponse(question);
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
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'farmer-message' : 'ai-message'}`}>
                {message.content}
              </div>
            </div>
          ))}
          
          {chatState.isLoading && (
            <div className="flex justify-start">
              <div className="ai-message flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-farm-green-500" />
                <span className="text-farm-brown-600 text-sm">FarmWise AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Suggested Questions */}
      <div className="p-3 bg-farm-green-100/50 border-t border-farm-green-500/30">
        <h3 className="text-xs font-medium text-farm-brown-600 mb-2">
          SUGGESTED QUESTIONS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleQuestions.slice(0, 4).map((question) => (
            <QuestionSuggestion
              key={question.id}
              question={question}
              onSelect={handleSuggestedQuestion}
            />
          ))}
        </div>
      </div>
      
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
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || chatState.isLoading}
            className="bg-farm-green-500 hover:bg-farm-green-700 text-white"
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
