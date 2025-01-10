import { useState } from 'react';
import ScriptInput from '@/components/ScriptInput';
import DurationSelector from '@/components/DurationSelector';
import ApiKeyInput from '@/components/ApiKeyInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(30);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleGenerate = async () => {
    // TODO: Implement video generation logic
    console.log('Generating video with:', { script, duration });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI YouTube Shorts Generator</h1>
          <p className="text-lg text-gray-600">
            Create engaging short videos from your script using AI-powered scene selection
          </p>
        </div>

        {!geminiApiKey && (
          <ApiKeyInput onSave={setGeminiApiKey} />
        )}

        <div className="space-y-6">
          <ScriptInput script={script} setScript={setScript} />
          
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Video Duration</h3>
              <DurationSelector duration={duration} setDuration={setDuration} />
            </div>
          </Card>

          <Button 
            onClick={handleGenerate}
            className="w-full py-6 text-lg"
            disabled={!script.trim() || !geminiApiKey}
          >
            Generate Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;