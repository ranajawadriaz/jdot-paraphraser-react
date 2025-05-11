
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

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
        className="bg-paraphraser-primary hover:bg-paraphraser-hover text-white rounded-full shadow-md transition-all duration-300 hover:scale-105"
        size="sm"
      >
        <Wand2 className="h-4 w-4 mr-1" />
        {isLoading ? 'Paraphrasing...' : 'Paraphrase'}
      </Button>
    </div>
  );
};

export default FloatingButton;
