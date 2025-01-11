import { useState, useEffect } from 'react';
import ScriptInput from '@/components/ScriptInput';
import DurationSelector from '@/components/DurationSelector';
import FormatSelector from '@/components/FormatSelector';
import KeywordManager, { KeywordTiming } from '@/components/KeywordManager';
import PixabayKeyInput from '@/components/PixabayKeyInput';
import GoogleApiKeyInput from '@/components/GoogleApiKeyInput';
import VideoEditor from '@/components/VideoEditor';
import { Card } from '@/components/ui/card';
import { testPixabayConnection } from '@/lib/pixabay';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState(30);
  const [format, setFormat] = useState<'portrait' | 'landscape'>('portrait');
  const [keywords, setKeywords] = useState<KeywordTiming[]>([]);
  const [pixabayApiKey, setPixabayApiKey] = useState(localStorage.getItem('pixabay_api_key') || '');
  const [pixabayConnected, setPixabayConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini-pro');

  useEffect(() => {
    const checkConnections = async () => {
      const pixabayStatus = await testPixabayConnection();
      setPixabayConnected(pixabayStatus);
      
      const googleApiKey = localStorage.getItem('google_api_key');
      setGoogleConnected(!!googleApiKey);
    };

    checkConnections();
  }, [pixabayApiKey]);

  const handleExtractKeywords = (extractedKeywords: KeywordTiming[]) => {
    setKeywords(extractedKeywords);
  };

  const totalKeywordsDuration = keywords.reduce((sum, k) => sum + k.duration, 0);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">AI YouTube Shorts Generator</h1>
          <p className="text-lg text-muted-foreground">
            Create engaging short videos from your script using AI-powered scene selection
          </p>
        </div>

        <Card className="p-6 bg-card">
          <div 
            className="flex justify-between items-center cursor-pointer" 
            onClick={() => setShowApiSettings(!showApiSettings)}
          >
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
              {!googleConnected && <GoogleApiKeyInput />}
              {googleConnected && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gemini Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <ScriptInput 
            script={script} 
            setScript={setScript} 
            onExtractKeywords={handleExtractKeywords}
          />
          
          <Card className="p-6 bg-card">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Video Settings</h3>
              <DurationSelector duration={duration} setDuration={setDuration} />
              <FormatSelector format={format} setFormat={setFormat} />
            </div>
          </Card>

          <KeywordManager 
            keywords={keywords}
            setKeywords={setKeywords}
            totalDuration={totalKeywordsDuration}
            targetDuration={duration}
          />

          <VideoEditor 
            keywords={keywords}
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