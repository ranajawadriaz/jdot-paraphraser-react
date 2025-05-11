
import React, { useState, useRef, useEffect } from 'react';
import FloatingButton from './FloatingButton';
import { paraphraseText } from '../services/paraphraserService';
import { useToast } from "@/hooks/use-toast";

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
      const { start, end, text: selectedText } = selection;
      
      const reader = await paraphraseText(selectedText).then(stream => stream.getReader());
      
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
      <div 
        ref={textRef}
        className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 min-h-[400px] max-w-4xl mx-auto whitespace-pre-wrap"
        contentEditable={!isParaphrasing}
        suppressContentEditableWarning={true}
        onInput={(e) => setText(e.currentTarget.textContent || '')}
      >
        {text}
      </div>
      
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
