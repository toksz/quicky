import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { PixabayVideo } from '@/lib/pixabay';

interface VideoEditorProps {
  videos: PixabayVideo[];
  script: string;
  duration: number;
}

const VideoEditor = ({ videos, script, duration }: VideoEditorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // Simulate progress for demonstration
  const startGeneration = () => {
    setCurrentStep(1);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCurrentStep((s) => Math.min(s + 1, 4));
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const steps = [
    { id: 1, name: 'Analyzing Script', description: 'Using Gemini AI to analyze script content' },
    { id: 2, name: 'Fetching Videos', description: 'Retrieving relevant stock footage' },
    { id: 3, name: 'Processing Videos', description: 'Trimming and combining footage' },
    { id: 4, name: 'Finalizing', description: 'Preparing final video output' },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Video Generation Progress</h3>
        <button
          onClick={startGeneration}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Start Generation
        </button>
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

      {videos.length > 0 && currentStep > 2 && (
        <div className="space-y-4">
          <h4 className="font-medium">Selected Footage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative">
                <video
                  src={video.videos.small.url}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: '200px' }}
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
    </Card>
  );
};

export default VideoEditor;