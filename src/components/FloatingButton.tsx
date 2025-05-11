
import React from 'react';
import { Button } from "@/components/ui/button";

interface FloatingButtonProps {
  position: { top: number; left: number };
  onClick: () => void;
  isLoading: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ position, onClick, isLoading }) => {
  return (
    <div 
      className="fixed z-50 animate-fade-in"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translate(-50%, -120%)' 
      }}
    >
      <Button 
        onClick={onClick}
        disabled={isLoading}
        className="bg-paraphraser-primary hover:bg-paraphraser-hover text-white rounded-full shadow-md"
        size="sm"
      >
        {isLoading ? 'Paraphrasing...' : 'Paraphrase'}
      </Button>
    </div>
  );
};

export default FloatingButton;
