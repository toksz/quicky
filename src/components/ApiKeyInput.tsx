import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
}

const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onSave(apiKey.trim());
      toast.success('API key saved successfully');
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">Gemini API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Enter your Gemini API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <Button onClick={handleSave} className="w-full">
        Save API Key
      </Button>
    </Card>
  );
};

export default ApiKeyInput;