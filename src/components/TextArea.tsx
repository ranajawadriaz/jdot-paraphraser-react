
import React, { useState, useRef, useEffect } from 'react';
import FloatingButton from './FloatingButton';
import { paraphraseText } from '../services/paraphraserService';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

const DEFAULT_TEXT = `Artificial intelligence is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions) and self-correction.

Particular applications of AI include expert systems, speech recognition and machine vision. AI can be categorized as either weak or strong. Weak AI, also known as narrow AI, is an AI system that is designed and trained for a particular task. Virtual personal assistants, such as Apple's Siri, are a form of weak AI. Strong AI, also known as artificial general intelligence, is an AI system with generalized human cognitive abilities.`;

const TextArea: React.FC = () => {
  const { toast } = useToast();
  const [text, setText] = useState(DEFAULT_TEXT);
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
  }, []);

  const handleParaphrase = async () => {
    if (!selection) return;
    
    try {
      setIsParaphrasing(true);
      toast({
        title: "Processing",
        description: "AI is paraphrasing your text...",
      });
      
      const { start, end, text: selectedText } = selection;
      
      const stream = await paraphraseText(selectedText);
      const reader = stream.getReader();
      
      let newText = '';
      let partialText = '';
      
      // Start with the text before the selection
      newText = text.slice(0, start);
      
      const processTextChunk = async () => {
        try {
          const { done, value } = await reader.read();
          
          if (done) {
            // Finish the text replacement and update
            setText(newText + partialText + text.slice(end));
            setIsParaphrasing(false);
            setSelection(null);
            toast({
              title: "Success",
              description: "Your text has been paraphrased!",
            });
            return;
          }
          
          // Append the chunk to our partial result
          partialText += value;
          
          // Update the text with what we have so far
          setText(newText + partialText + text.slice(end));
          
          // Process the next chunk
          processTextChunk();
        } catch (error) {
          handleParaphrasingError();
        }
      };
      
      // Start processing chunks
      processTextChunk();
      
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

  return (
    <div className="relative">
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200 rounded-t-lg">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {isParaphrasing && (
              <div className="flex items-center text-sm text-paraphraser-text">
                <Loader className="animate-spin h-4 w-4 mr-1"/> 
                Paraphrasing...
              </div>
            )}
          </div>
          <div 
            ref={textRef}
            className="p-6 min-h-[400px] max-w-4xl mx-auto whitespace-pre-wrap font-sans text-lg text-gray-800 focus:outline-none"
            contentEditable={!isParaphrasing}
            suppressContentEditableWarning={true}
            onInput={(e) => setText(e.currentTarget.textContent || '')}
          >
            {text}
          </div>
        </CardContent>
      </Card>
      
      {selection && selection.rect && !isParaphrasing && (
        <FloatingButton 
          position={{ 
            top: window.scrollY + selection.rect.top, 
            left: window.scrollX + selection.rect.left + selection.rect.width / 2
          }}
          onClick={handleParaphrase}
          isLoading={isParaphrasing}
        />
      )}
    </div>
  );
};

export default TextArea;
