
import React from 'react';
import { Sparkles } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-8 border-b border-gray-200 bg-gradient-to-r from-paraphraser-light to-white">
      <div className="max-w-4xl mx-auto px-6 flex items-center">
        <div>
          <h1 className="text-3xl font-bold text-paraphraser-text flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-paraphraser-primary" /> 
            AI Paraphraser
          </h1>
          <p className="text-gray-600 mt-1">
            Select any text to paraphrase it with AI in seconds
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
