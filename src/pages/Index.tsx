import { useState, useEffect } from 'react';
import ScriptInput from '@/components/ScriptInput';
import DurationSelector from '@/components/DurationSelector';
import ApiKeyInput from '@/components/ApiKeyInput';
import PixabayKeyInput from '@/components/PixabayKeyInput';
import GoogleApiKeyInput from '@/components/GoogleApiKeyInput';
import GeminiModelSelector from '@/components/GeminiModelSelector';
import VideoPreview from '@/components/VideoPreview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testPixabayConnection } from '@/lib/pixabay';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { PixabayVideo } from '@/lib/pixabay';

const Index = () => {
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(30);
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [pixabayApiKey, setPixabayApiKey] = useState(localStorage.getItem('pixabay_api_key') || '');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-pro');
  const [pixabayConnected, setPixabayConnected] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<PixabayVideo[]>([]);

  useEffect(() => {
    const checkConnections = async () => {
      // Check Pixabay connection
      const pixabayStatus = await testPixabayConnection();
      setPixabayConnected(pixabayStatus);
      
      // Check Gemini connection (simplified check - just verifying key exists)
      setGeminiConnected(!!geminiApiKey);
    };

    checkConnections();
  }, [geminiApiKey, pixabayApiKey]);

  const handleGenerate = async () => {
    if (!pixabayConnected || !geminiConnected) {
      toast.error('Please configure both API keys first');
      return;
    }

    // TODO: Implement video generation logic
    console.log('Generating video with:', { script, duration, geminiModel });
    toast.info('Video generation started...');
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

        <div className="flex gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Pixabay:</span>
            {pixabayConnected ? (
              <CheckCircle2 className="text-green-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Gemini:</span>
            {geminiConnected ? (
              <CheckCircle2 className="text-green-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </div>
        </div>

        {!geminiApiKey && (
          <ApiKeyInput onSave={setGeminiApiKey} />
        )}

        {!pixabayApiKey && (
          <PixabayKeyInput onSave={setPixabayApiKey} />
        )}

        <GoogleApiKeyInput />

        <div className="space-y-6">
          <ScriptInput script={script} setScript={setScript} />
          
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Video Settings</h3>
              <DurationSelector duration={duration} setDuration={setDuration} />
              <GeminiModelSelector model={geminiModel} setModel={setGeminiModel} />
            </div>
          </Card>

          <VideoPreview videos={selectedVideos} />

          <Button 
            onClick={handleGenerate}
            className="w-full py-6 text-lg"
            disabled={!script.trim() || !pixabayConnected || !geminiConnected}
          >
            Generate Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;