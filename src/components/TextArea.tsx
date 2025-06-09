
import React, { useState, useRef, useEffect } from 'react';
import FloatingButton from './FloatingButton';
import { paraphraseText } from '../services/paraphraserService';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, ArrowRight, Text } from "lucide-react";

const TextArea: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
    rect?: DOMRect;
  } | null>(null);
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (isParaphrasing) return;
      
      const currentSelection = window.getSelection();
      
      if (!currentSelection || currentSelection.isCollapsed) {
        setSelection(null);
        return;
      }

      const range = currentSelection.getRangeAt(0);
      const textContent = textRef.current?.textContent || '';
      
      // Only handle selections within our text area
      if (textRef.current?.contains(range.commonAncestorContainer)) {
        // Get the selection boundaries within the text
        const preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(textRef.current);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        const start = preSelectionRange.toString().length;
        
        const selectedText = range.toString();
        
        // Only show button for meaningful selections
        if (selectedText.trim().length > 0) {
          setSelection({
            start,
            end: start + selectedText.length,
            text: selectedText,
            rect: range.getBoundingClientRect()
          });
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isParaphrasing]);

  const handleParaphrase = async (selectedText?: string, start?: number, end?: number) => {
    try {
      // If no params provided, paraphrase all text
      const textToParaphrase = selectedText || text;
      const startPos = start !== undefined ? start : 0;
      const endPos = end !== undefined ? end : text.length;
      
      if (!textToParaphrase.trim()) {
        toast({
          title: "Empty Text",
          description: "Please enter some text to paraphrase.",
          variant: "destructive"
        });
        return;
      }
      
      setIsParaphrasing(true);
      toast({
        title: "Processing",
        description: "AI is paraphrasing your text...",
      });
      
      // Get paraphrased text as a string instead of a stream
      const paraphrased = await paraphraseText(textToParaphrase);
      
      // Create new text by replacing the selected portion with paraphrased text
      const newText = text.substring(0, startPos) + paraphrased + text.substring(endPos);
      
      // Update the text state and the contentEditable div
      setText(newText);
      if (textRef.current) {
        textRef.current.textContent = newText;
      }
      
      setIsParaphrasing(false);
      setSelection(null);
      toast({
        title: "Success",
        description: "Your text has been paraphrased!",
      });
    } catch (error) {
      handleParaphrasingError();
    }
  };
  
  const handleParaphrasingError = () => {
    setIsParaphrasing(false);
    toast({
      title: "Error",
      description: "Failed to paraphrase text. Please try again.",
      variant: "destructive"
    });
  };

  const handleParaphraseAll = () => {
    handleParaphrase();
  };

  // Fixed the text input handling to prevent reversed text
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setText(e.currentTarget.textContent || '');
  };

  return (
    <div className="relative">
      <Card className="border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 border-b border-gray-200 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {isParaphrasing && (
              <div className="flex items-center text-xs sm:text-sm text-paraphraser-text animate-fade-in">
                <Loader className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1"/> 
                Paraphrasing...
              </div>
            )}
          </div>
          <div 
            ref={textRef}
            className="p-4 sm:p-6 min-h-[250px] sm:min-h-[350px] md:min-h-[400px] max-w-4xl mx-auto whitespace-pre-wrap font-sans text-base sm:text-lg text-gray-800 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:italic"
            contentEditable={!isParaphrasing}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            data-placeholder="Paste your text here to paraphrase"
            style={{ lineHeight: "1.6" }}
          ></div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4">
        <Button
          onClick={handleParaphraseAll}
          disabled={isParaphrasing || !text.trim()}
          className="bg-paraphraser-primary hover:bg-paraphraser-hover text-white rounded-full shadow-md transition-all duration-300 hover:scale-105"
        >
          <Text className="h-4 w-4 mr-2" />
          Paraphrase All
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {selection && selection.rect && !isParaphrasing && (
        <FloatingButton 
          position={{ 
            top: window.scrollY + selection.rect.top, 
            left: window.scrollX + selection.rect.left + selection.rect.width / 2
          }}
          onClick={() => handleParaphrase(selection.text, selection.start, selection.end)}
          isLoading={isParaphrasing}
        />
      )}
    </div>
  );
};

export default TextArea;
