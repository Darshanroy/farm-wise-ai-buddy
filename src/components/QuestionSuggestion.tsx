
import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionSuggestion as QuestionSuggestionType } from '@/types/chat';

interface QuestionSuggestionProps {
  question: QuestionSuggestionType;
  onSelect: (question: string) => void;
}

const categoryIcons = {
  crops: '🌱',
  weather: '☁️',
  pests: '🐞',
  general: '🔧',
};

const QuestionSuggestion: React.FC<QuestionSuggestionProps> = ({ question, onSelect }) => {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 py-2 px-3 border border-farm-green-500/50 hover:border-farm-green-500 text-left h-auto whitespace-normal justify-start"
      onClick={() => onSelect(question.text)}
    >
      <span>{categoryIcons[question.category]}</span>
      <span className="text-sm font-normal">{question.text}</span>
    </Button>
  );
};

export default QuestionSuggestion;
