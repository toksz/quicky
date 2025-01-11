import { useState, useEffect } from 'react';
import ScriptInput from '@/components/ScriptInput';
import DurationSelector from '@/components/DurationSelector';
import FormatSelector from '@/components/FormatSelector';
import PixabayKeyInput from '@/components/PixabayKeyInput';
import GoogleApiKeyInput from '@/components/GoogleApiKeyInput';
import VideoEditor from '@/components/VideoEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testPixabayConnection } from '@/lib/pixabay';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { PixabayVideo } from '@/lib/pixabay';

const Index = () => {
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState<'portrait' | 'landscape'>('portrait');
  const [pixabayApiKey, setPixabayApiKey] = useState(localStorage.getItem('pixabay_api_key') || '');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-pro');
  const [pixabayConnected, setPixabayConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<PixabayVideo[]>([]);
  const [showApiSettings, setShowApiSettings] = useState(true);

  useEffect(() => {
    const checkConnections = async () => {
      // Check Pixabay connection
      const pixabayStatus = await testPixabayConnection();
      setPixabayConnected(pixabayStatus);
      
      // Check Google API connection
      const googleApiKey = localStorage.getItem('google_api_key');
      setGoogleConnected(!!googleApiKey);
    };

    checkConnections();
  }, [pixabayApiKey]);

  const handleGenerate = async () => {
    if (!pixabayConnected || !googleConnected) {
      toast.error('Please configure both API keys first');
      return;
    }

    if (!script.trim()) {
      toast.error('Please enter a script first');
      return;
    }
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

        <Card className="p-6">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowApiSettings(!showApiSettings)}>
            <div className="flex gap-6 items-center">
              <h3 className="text-lg font-semibold">API Settings</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Pixabay:</span>
                  {pixabayConnected ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Google API:</span>
                  {googleConnected ? (
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
            {showApiSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>

          {showApiSettings && (
            <div className="mt-6 space-y-6">
              {!pixabayConnected && <PixabayKeyInput onSave={setPixabayApiKey} />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GoogleApiKeyInput />
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <ScriptInput script={script} setScript={setScript} />
          
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Video Settings</h3>
              <DurationSelector duration={duration} setDuration={setDuration} />
              <FormatSelector format={format} setFormat={setFormat} />
            </div>
          </Card>

          <VideoEditor 
            videos={selectedVideos}
            script={script}
            duration={duration}
            format={format}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;