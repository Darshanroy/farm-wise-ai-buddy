
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

export interface QuestionSuggestion {
  id: string;
  text: string;
  category: 'crops' | 'weather' | 'pests' | 'general';
}
