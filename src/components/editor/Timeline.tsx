import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export const Timeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="w-full bg-editor-secondary p-4 rounded-lg animate-fade-in">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setCurrentTime(0)}
          className="p-2 hover:bg-editor-hover rounded-full transition-colors"
        >
          <SkipBack className="w-4 h-4 text-editor-text" />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 hover:bg-editor-hover rounded-full transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-editor-text" />
          ) : (
            <Play className="w-4 h-4 text-editor-text" />
          )}
        </button>
        <button
          onClick={() => setCurrentTime(100)}
          className="p-2 hover:bg-editor-hover rounded-full transition-colors"
        >
          <SkipForward className="w-4 h-4 text-editor-text" />
        </button>
        <div className="text-editor-text text-sm">
          {formatTime(currentTime)} / {formatTime(100)}
        </div>
      </div>
      <div className="relative w-full h-24 bg-editor-bg rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full px-4">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => setCurrentTime(value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <WaveformVisualizer />
        </div>
      </div>
    </div>
  );
};

const WaveformVisualizer = () => {
  return (
    <div className="w-full h-full flex items-center justify-center gap-0.5">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-editor-accent/20 rounded-full"
          style={{
            height: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
