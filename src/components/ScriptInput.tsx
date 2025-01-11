import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeywordTiming } from './KeywordManager';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  onExtractKeywords: (keywords: KeywordTiming[]) => void;
}

const ScriptInput = ({ script, setScript, onExtractKeywords }: ScriptInputProps) => {
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
  };

  const getEstimatedDuration = (text: string) => {
    // Average speaking rate is about 150 words per minute
    const words = text.trim().split(/\s+/).length;
    return Math.ceil((words / 150) * 60);
  };

  const getSentences = () => {
    // Improved sentence splitting that preserves punctuation and handles common abbreviations
    const abbreviations = ['mr.', 'mrs.', 'dr.', 'prof.', 'sr.', 'jr.', 'vs.', 'etc.', 'e.g.', 'i.e.'];
    let text = script.trim();
    
    // Replace periods in abbreviations temporarily
    abbreviations.forEach(abbr => {
      text = text.replace(new RegExp(abbr + '\\s', 'gi'), abbr.replace('.', '@') + ' ');
    });

    // Split by sentence endings while preserving the punctuation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // Restore periods in abbreviations and trim whitespace
    return sentences.map(sentence => {
      abbreviations.forEach(abbr => {
        sentence = sentence.replace(new RegExp(abbr.replace('.', '@'), 'gi'), abbr);
      });
      return sentence.trim();
    }).filter(s => s.length > 0);
  };

  const extractKeywords = () => {
    if (script.trim().length === 0) {
      toast.error('Please enter a script first');
      return;
    }

    const sentences = getSentences();
    const keywords: KeywordTiming[] = [];
    
    sentences.forEach((sentence, index) => {
      // Enhanced keyword extraction with better filtering and importance scoring
      const words = sentence
        .trim()
        .toLowerCase()
        .split(' ')
        .filter(word => {
          // Filter out common words and keep meaningful ones
          const commonWords = ['and', 'the', 'this', 'that', 'with', 'from', 'what', 'where', 'when', 'how', 'was', 'were', 'will', 'would', 'could', 'should', 'have', 'has', 'had', 'been'];
          return word.length > 3 && !commonWords.includes(word);
        });

      // Score words based on position and length
      const scoredWords = words.map((word, idx) => ({
        word,
        score: (word.length * 0.5) + // longer words might be more significant
          (idx === 0 ? 2 : 0) + // first word bonus
          (idx === words.length - 1 ? 1 : 0) // last word bonus
      }));

      // Sort by score and take the highest scoring word
      scoredWords.sort((a, b) => b.score - a.score);
      
      if (scoredWords.length > 0) {
        keywords.push({
          id: Date.now().toString() + index,
          keyword: scoredWords[0].word,
          duration: Math.max(5, Math.min(10, getEstimatedDuration(sentence))) // Between 5-10 seconds
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
    <Card className="p-6 space-y-6 bg-secondary/5">
      <div className="space-y-2">
        <Label htmlFor="script" className="text-lg font-semibold">Video Script</Label>
        <Textarea
          id="script"
          placeholder="Enter your video script here..."
          className="min-h-[200px] resize-none bg-background/50"
          value={script}
          onChange={handleScriptChange}
        />
      </div>

      {script.trim().length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Script Timeline</h3>
            <div className="space-y-3">
              {getSentences().map((sentence, index) => (
                <div key={index} className="flex justify-between items-start gap-4 p-2 rounded-md bg-secondary/10">
                  <div className="flex-1">
                    <p className="text-sm">{sentence}</p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    ~{getEstimatedDuration(sentence)}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Total estimated duration: {getEstimatedDuration(script)}s
        </div>
        <Button onClick={extractKeywords} variant="default">
          Extract Keywords
        </Button>
      </div>
    </Card>
  );
};

export default ScriptInput;