import { useState } from "react";
import { UserRound, Text, Image as ImageIcon, Music, Wand2 } from "lucide-react";
import { RunwareService, GenerateImageParams } from "@/lib/runware";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SceneProps {
  sceneNumber: number;
  voiceoverText: string;
  onClose?: () => void;
  onVoiceoverChange: (newText: string) => void;
  artStyle: string;
  characterDescription: string;
}

export const Scene = ({ sceneNumber, voiceoverText, onClose, onVoiceoverChange, artStyle, characterDescription }: SceneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  const handleVoiceoverChangeLocal = (value: string) => {
    onVoiceoverChange(value);
  };

  const handleGenerateImage = async () => {
    if (!voiceoverText) {
      toast.error("Please enter some voiceover text first");
      return;
    }

    setIsGenerating(true);
    try {
      const imageService = new RunwareService("dummy-key");
      
      const fullPrompt = `${artStyle} style, ${characterDescription} in a scene where ${voiceoverText}`;

      const params: GenerateImageParams = {
        positivePrompt: fullPrompt,
        numberResults: 1,
      };

      const result = await imageService.generateImage(params);
      setGeneratedImageUrl(result.imageURL);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-editor-secondary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-editor-text font-medium">Scene {sceneNumber}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-editor-text hover:text-editor-accent"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-editor-text">Single Scene Voiceover</Label>
            <Textarea
              value={voiceoverText}
              onChange={(e) => handleVoiceoverChangeLocal(e.target.value)}
              className="bg-editor-bg text-editor-text rounded-lg p-2 min-h-[100px] resize-none"
              placeholder="Enter the scene's voiceover text..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-editor-accent text-white px-4 py-2 rounded-lg hover:bg-editor-accent/80 transition-colors disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex flex-col items-center gap-1 p-4 bg-editor-bg rounded-lg hover:bg-editor-hover transition-colors">
              <Text className="w-6 h-6 text-editor-accent" />
              <span className="text-xs text-editor-text">Text</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-4 bg-editor-bg rounded-lg hover:bg-editor-hover transition-colors">
              <ImageIcon className="w-6 h-6 text-editor-accent" />
              <span className="text-xs text-editor-text">Media</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-4 bg-editor-bg rounded-lg hover:bg-editor-hover transition-colors">
              <UserRound className="w-6 h-6 text-editor-accent" />
              <span className="text-xs text-editor-text">Avatar</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-4 bg-editor-bg rounded-lg hover:bg-editor-hover transition-colors">
              <Music className="w-6 h-6 text-editor-accent" />
              <span className="text-xs text-editor-text">Audio</span>
            </button>
          </div>

          {generatedImageUrl && (
            <div className="relative aspect-video bg-editor-bg rounded-lg overflow-hidden">
              <img
                src={generatedImageUrl}
                alt="Generated scene"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
