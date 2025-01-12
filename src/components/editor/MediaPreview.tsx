import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export const MediaPreview = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`relative bg-editor-bg rounded-lg overflow-hidden animate-fade-in ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full aspect-video'}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-editor-text opacity-50">Preview Window</div>
      </div>
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-4 right-4 p-2 bg-editor-secondary/80 hover:bg-editor-hover rounded-lg transition-colors"
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 text-editor-text" />
        ) : (
          <Maximize2 className="w-4 h-4 text-editor-text" />
        )}
      </button>
    </div>
  );
};
