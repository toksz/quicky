import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { PixabayVideo, searchVideos } from '@/lib/pixabay';
import { toast } from 'sonner';
import { KeywordTiming } from './KeywordManager';

interface VideoEditorProps {
  keywords: KeywordTiming[];
  script: string;
  duration: number;
  format: 'portrait' | 'landscape';
}

const VideoEditor = ({ keywords, script, duration, format }: VideoEditorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedVideos, setSelectedVideos] = useState<(PixabayVideo & { duration: number })[]>([]);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  const steps = [
    { id: 1, name: 'Fetching Videos', description: 'Finding perfect background clips' },
    { id: 2, name: 'Processing Videos', description: 'Trimming to perfect length' },
    { id: 3, name: 'Finalizing', description: 'Preparing downloadable video' },
  ];

  const startGeneration = async () => {
    try {
      if (keywords.length === 0) {
        toast.error('Please add at least one keyword');
        return;
      }

      setCurrentStep(1);
      setProgress(0);
      setFinalVideoUrl(null);
      const fetchedVideos: (PixabayVideo & { duration: number })[] = [];

      // Step 1: Fetch videos for each keyword
      for (const [index, keyword] of keywords.entries()) {
        const results = await searchVideos(keyword.keyword);
        if (results.length > 0) {
          // Pick a random video from first 3 results
          const randomIndex = Math.floor(Math.random() * Math.min(3, results.length));
          fetchedVideos.push({ ...results[randomIndex], duration: keyword.duration });
        }
        setProgress((index + 1) * (100 / keywords.length));
      }

      setSelectedVideos(fetchedVideos);
      await simulateProgress(1);

      // Step 2: Process videos
      setCurrentStep(2);
      setProgress(0);
      await simulateProgress(2);

      // Step 3: Finalize
      setCurrentStep(3);
      setProgress(0);
      await simulateProgress(3);

      // Set the URL of the first video as the final video
      if (selectedVideos.length > 0) {
        setFinalVideoUrl(selectedVideos[0].videos.small.url);
        toast.success('Video generation completed!');
      }
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

  const handleDownloadAll = () => {
    if (selectedVideos.length === 0) {
      toast.error('No videos available to download');
      return;
    }

    selectedVideos.forEach((video, index) => {
      const link = document.createElement('a');
      link.href = video.videos.small.url;
      link.download = `background-video-${index + 1}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    
    toast.success('Download of all videos started!');
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Video Generation Progress</h3>
        <Button
          onClick={startGeneration}
          disabled={currentStep !== 0}
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

      {selectedVideos.length > 0 && currentStep > 1 && (
        <div className="space-y-4">
          <h4 className="font-medium">Selected Background Footage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedVideos.map((video, index) => (
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
                  {video.duration}s - {keywords[index]?.keyword}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {finalVideoUrl && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Background Video
          </Button>
          <Button
            onClick={handleDownloadAll}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download All Videos
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VideoEditor;
