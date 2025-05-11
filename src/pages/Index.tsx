
import React from 'react';
import Header from '../components/Header';
import TextArea from '../components/TextArea';
import { Card, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-paraphraser-light to-white">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-6 max-w-4xl mx-auto">
          <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium text-paraphraser-text mb-3 flex items-center">
                Instructions
              </h2>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-sm font-semibold text-white bg-paraphraser-primary rounded-full">1</span>
                  Select any text in the editor below
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-sm font-semibold text-white bg-paraphraser-primary rounded-full">2</span>
                  Click the "Paraphrase" button that appears
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-sm font-semibold text-white bg-paraphraser-primary rounded-full">3</span>
                  Watch as the AI rewrites your selection
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <TextArea />
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8 max-w-4xl mx-auto py-4">
          <div className="flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold">Google Gemini 1.5 Flash</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
