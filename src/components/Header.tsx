
import React from 'react';
import { Sparkles } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 sm:py-6 md:py-8 border-b border-gray-200 bg-gradient-to-r from-paraphraser-light to-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 flex items-center">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-paraphraser-text flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-paraphraser-primary" /> 
            Jdot Paraphraser
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
            Paste and Select any text to paraphrase it with AI in seconds
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
