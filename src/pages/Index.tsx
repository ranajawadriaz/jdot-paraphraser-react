
import React from 'react';
import Header from '../components/Header';
import TextArea from '../components/TextArea';
import { Card, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-paraphraser-light to-white">
      <Header />
      
      <main className="container px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
        <div className="mb-3 sm:mb-4 md:mb-6 max-w-4xl mx-auto">
          <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-medium text-paraphraser-text mb-2 flex items-center">
                Instructions
              </h2>
              <ul className="space-y-1 sm:space-y-2">
                <li className="flex items-center text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 text-xs font-semibold text-white bg-paraphraser-primary rounded-full">1</span>
                  Paste and Select any text in the editor below
                </li>
                <li className="flex items-center text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 text-xs font-semibold text-white bg-paraphraser-primary rounded-full">2</span>
                  Click the "Paraphrase" button that appears
                </li>
                <li className="flex items-center text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 text-xs font-semibold text-white bg-paraphraser-primary rounded-full">3</span>
                  Watch as the AI rewrites your selection
                </li>
                <li className="flex items-center text-xs sm:text-sm md:text-base text-gray-700">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 text-xs font-semibold text-white bg-paraphraser-primary rounded-full">4</span>
                  Or use "Paraphrase All" to paraphrase the entire text
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <TextArea />
        </div>
        
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 md:mt-8 max-w-4xl mx-auto py-3 sm:py-4">
          <div className="flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold">Jdot Gen Model</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
