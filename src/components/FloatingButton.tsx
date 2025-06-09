
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FloatingButtonProps {
  position: { top: number; left: number };
  onClick: () => void;
  isLoading: boolean;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ position, onClick, isLoading }) => {
  return (
    <div 
      className="fixed z-50 animate-fade-in transition-all duration-300"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translate(-50%, -120%)' 
      }}
    >
      <Button 
        onClick={onClick}
        disabled={isLoading}
        className="bg-paraphraser-primary hover:bg-paraphraser-hover text-white rounded-full shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
        size="sm"
      >
        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        {isLoading ? 'Paraphrasing...' : 'Paraphrase Selection'}
      </Button>
    </div>
  );
};

export default FloatingButton;
