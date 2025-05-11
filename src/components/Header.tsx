
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-gray-200 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-paraphraser-text">AI Paraphraser</h1>
        <p className="text-gray-600 mt-1">
          Select any text to paraphrase it with AI
        </p>
      </div>
    </header>
  );
};

export default Header;
