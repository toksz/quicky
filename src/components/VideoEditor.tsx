import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { PixabayVideo, searchVideos } from '@/lib/pixabay';
import { toast } from 'sonner';

interface VideoEditorProps {
  videos: PixabayVideo[];
  script: string;
  duration: number;
  format: 'portrait' | 'landscape';
}

const VideoEditor = ({ videos, script, duration, format }: VideoEditorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState<PixabayVideo[]>([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  const steps = [
    { id: 1, name: 'Analyzing Script', description: 'Extracting key moments' },
    { id: 2, name: 'Fetching Videos', description: 'Finding perfect background clips' },
    { id: 3, name: 'Processing Videos', description: 'Trimming to perfect length' },
    { id: 4, name: 'Finalizing', description: 'Preparing downloadable video' },
  ];

  const extractKeywords = (text: string): { keyword: string, timestamp: number }[] => {
    const words = text.toLowerCase().split(' ');
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    // Calculate words per second based on duration
    const wordsPerSecond = words.length / duration;
    
    return words
      .map((word, index) => ({
        word,
        timestamp: Math.floor(index / wordsPerSecond)
      }))
      .filter(({ word }) => !stopWords.has(word) && word.length > 3)
      .map(({ word, timestamp }) => ({
        keyword: word,
        timestamp
      }))
      .filter((item, index, self) => 
        index === self.findIndex((t) => t.timestamp === item.timestamp)
      )
      .slice(0, Math.ceil(duration / 5)); // One keyword every ~5 seconds
  };

  const startGeneration = async () => {
    try {
      setCurrentStep(1);
      setProgress(0);
      setFinalVideoUrl(null);

      // Step 1: Analyze script and extract key moments
      const keywordTimings = extractKeywords(script);
      await simulateProgress(1);

      // Step 2: Fetch relevant videos
      setCurrentStep(2);
      setProgress(0);
      const fetchedVideos: PixabayVideo[] = [];
      
      for (const { keyword } of keywordTimings) {
        const results = await searchVideos(keyword);
        if (results.length > 0) {
          // Pick a random video from first 3 results
          const randomIndex = Math.floor(Math.random() * Math.min(3, results.length));
          fetchedVideos.push(results[randomIndex]);
        }
        setProgress((prevProgress) => prevProgress + (100 / keywordTimings.length));
      }

      setSelectedVideos(fetchedVideos);
      await simulateProgress(2);

      // Step 3: Process videos
      setCurrentStep(3);
      setProgress(0);
      await simulateProgress(3);

      // Step 4: Finalize
      setCurrentStep(4);
      setProgress(0);
      await simulateProgress(4);

      // Set the URL of the first video as the final video (in a real implementation, 
      // this would be the combined video URL)
      if (selectedVideos.length > 0) {
        setFinalVideoUrl(selectedVideos[0].videos.small.url);
      }

      toast.success('Video generation completed!');
    } catch (error) {
      toast.error('Error generating video: ' + (error as Error).message);
      setCurrentStep(0);
    }
  };

  const simulateProgress = (step: number) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    });
  };

  const handleDownload = () => {
    if (finalVideoUrl) {
      const link = document.createElement('a');
      link.href = finalVideoUrl;
      link.download = 'background-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Video Generation Progress</h3>
        <Button
          onClick={startGeneration}
          disabled={currentStep !== 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Generation
        </Button>
      </div>

      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center gap-3">
              {currentStep === step.id && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              )}
              {currentStep > step.id && (
                <div className="w-4 h-4 rounded-full bg-green-500" />
              )}
              {currentStep < step.id && (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
              )}
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">{step.name}</span>
                <span className="text-sm text-gray-500">{step.description}</span>
              </div>
            </div>
            {currentStep === step.id && (
              <Progress value={progress} className="h-2" />
            )}
          </div>
        ))}
      </div>

      {selectedVideos.length > 0 && currentStep > 2 && (
        <div className="space-y-4">
          <h4 className="font-medium">Selected Background Footage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedVideos.map((video) => (
              <div key={video.id} className="relative">
                <video
                  src={video.videos.small.url}
                  controls
                  className={`w-full rounded-lg ${
                    format === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'
                  }`}
                  style={{ objectFit: 'cover' }}
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {video.duration}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {finalVideoUrl && (
        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Background Video
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VideoEditor;