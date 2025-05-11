
import React from 'react';
import Header from '../components/Header';
import TextArea from '../components/TextArea';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-paraphraser-light">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-medium text-paraphraser-text mb-2">Instructions</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Select any text in the editor below</li>
            <li>Click the "Paraphrase" button that appears</li>
            <li>Watch as the AI rewrites your selection</li>
          </ul>
        </div>
        
        <TextArea />
        
        <div className="text-center text-sm text-gray-500 mt-8 max-w-4xl mx-auto">
          Powered by Google Gemini 2.5 Pro
        </div>
      </main>
    </div>
  );
};

export default Index;
