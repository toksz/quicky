import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeywordTiming } from './KeywordManager';
import { toast } from 'sonner';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  onExtractKeywords: (keywords: KeywordTiming[]) => void;
}

const ScriptInput = ({ script, setScript, onExtractKeywords }: ScriptInputProps) => {
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
  };

  const extractKeywords = () => {
    if (script.trim().length === 0) {
      toast.error('Please enter a script first');
      return;
    }

    // Split script into sentences and extract key nouns and verbs
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keywords: KeywordTiming[] = [];
    
    sentences.forEach((sentence, index) => {
      // Simple keyword extraction - get significant words
      const words = sentence
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => 
          word.length > 3 && 
          !['and', 'the', 'this', 'that', 'with', 'from', 'what', 'where', 'when', 'how'].includes(word)
        );

      // Take the most significant word from each sentence
      if (words.length > 0) {
        const keyword = words[Math.floor(words.length / 2)]; // Take middle word as likely most important
        keywords.push({
          id: Date.now().toString() + index,
          keyword: keyword,
          duration: 5 // Default duration of 5 seconds per keyword
        });
      }
    });

    if (keywords.length === 0) {
      toast.error('Could not extract meaningful keywords from the script');
      return;
    }

    onExtractKeywords(keywords);
    toast.success(`Extracted ${keywords.length} keywords from your script`);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="script">Video Script</Label>
        <Textarea
          id="script"
          placeholder="Enter your video script here..."
          className="min-h-[200px] resize-none"
          value={script}
          onChange={handleScriptChange}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {script.length} characters ({Math.ceil(script.length / 15)} seconds estimated)
        </div>
        <Button onClick={extractKeywords}>
          Extract Keywords
        </Button>
      </div>
    </Card>
  );
};

export default ScriptInput;