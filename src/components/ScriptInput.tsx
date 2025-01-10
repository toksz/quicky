import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
}

const ScriptInput = ({ script, setScript }: ScriptInputProps) => {
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
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
      <div className="text-sm text-gray-500">
        {script.length} characters ({Math.ceil(script.length / 15)} seconds estimated)
      </div>
    </Card>
  );
};

export default ScriptInput;