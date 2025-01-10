import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const GoogleApiKeyInput = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('google_api_key') || '');
  const [isVisible, setIsVisible] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    localStorage.setItem('google_api_key', apiKey);
    toast.success('Google API key saved successfully');
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Google API Key</h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google API key"
          />
          <Button
            variant="outline"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? 'Hide' : 'Show'}
          </Button>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save API Key
        </Button>
      </div>
    </Card>
  );
};

export default GoogleApiKeyInput;