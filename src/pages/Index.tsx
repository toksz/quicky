import { useState, useEffect } from "react";
import { Timeline } from "@/components/editor/Timeline";
import { MediaPreview } from "@/components/editor/MediaPreview";
import { FileBrowser } from "@/components/editor/FileBrowser";
import { ToolsPanel } from "@/components/editor/ToolsPanel";
import { Scene } from "@/components/editor/Scene";
import { Plus, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const [scenes, setScenes] = useState<{ id: number; voiceoverText: string }[]>([]);
  const [fullScript, setFullScript] = useState("");
  const [nextSceneId, setNextSceneId] = useState(1);
  const [artStyle, setArtStyle] = useState(() => {
    const saved = localStorage.getItem("artStyle");
    return saved || "realistic digital art";
  });
  const [characterDescription, setCharacterDescription] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState(() => {
    const saved = localStorage.getItem("googleApiKey");
    return saved || "";
  });
  const [geminiModel, setGeminiModel] = useState(() => {
    const saved = localStorage.getItem("geminiModel");
    return saved || "gemini-2.0-flash";
  });
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (fullScript) {
      const sentences = fullScript
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newScenes = sentences.map((sentence, index) => ({
        id: nextSceneId + index,
        voiceoverText: sentence,
      }));

      setScenes(newScenes);
      setNextSceneId(prevId => prevId + sentences.length);
    }
  }, [fullScript]);

  const handleArtStyleChange = (value: string) => {
    setArtStyle(value);
    localStorage.setItem("artStyle", value);
  };

  const handleGoogleApiKeyChange = (value: string) => {
    setGoogleApiKey(value);
    localStorage.setItem("googleApiKey", value);
  };

  const handleGeminiModelChange = (value: string) => {
    setGeminiModel(value);
    localStorage.setItem("geminiModel", value);
  };

  const handleVoiceoverChange = (id: number, newText: string) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) =>
        scene.id === id ? { ...scene, voiceoverText: newText } : scene
      )
    );
  };

  const addScene = () => {
    setScenes((prev) => [...prev, { id: nextSceneId, voiceoverText: "" }]);
    setNextSceneId(prevId => prevId + 1);
  };

  const removeScene = (id: number) => {
    setScenes((prev) => prev.filter((scene) => scene.id !== id));
  };

  const generateCharacterDescription = async () => {
    if (!fullScript) {
      toast.error("Please enter a script first");
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + googleApiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Create a brief character description based on this script: ${fullScript}. Focus on physical appearance and personality traits that can be visualized.`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      setCharacterDescription(text);
      localStorage.setItem("characterDescription", text);
      toast.success("Character description generated!");
    } catch (error) {
      console.error("Error generating character description:", error);
      toast.error("Failed to generate character description");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="min-h-screen bg-editor-bg p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-[auto_1fr] gap-6">
          <ToolsPanel />
          <div className="space-y-6">
            <MediaPreview />
            <Timeline />
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label className="text-editor-text">Google API Key</Label>
                <Input
                  value={googleApiKey}
                  onChange={(e) => handleGoogleApiKeyChange(e.target.value)}
                  className="bg-editor-bg text-editor-text"
                  placeholder="Enter your Google API key..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-editor-text">Gemini Model</Label>
                <Select onValueChange={handleGeminiModelChange} defaultValue={geminiModel}>
                  <SelectTrigger className="bg-editor-bg text-editor-text">
                    <SelectValue placeholder="Select a Gemini Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="gemini-1.5-flash-002">Gemini 1.5 Flash-002</SelectItem>
                    <SelectItem value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8b</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-pro-002">Gemini 1.5 Pro-002</SelectItem>
                    <SelectItem value="gemini-exp-1206">Gemini exp-1206</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-editor-text">Full Script (Optional)</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={generateCharacterDescription}
                    className="text-editor-accent hover:text-editor-accent/80"
                    disabled={isGeneratingDescription}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Character Description
                  </Button>
                </div>
                <textarea
                  value={fullScript}
                  onChange={(e) => setFullScript(e.target.value)}
                  className="bg-editor-bg text-editor-text rounded-lg p-2 min-h-[100px] resize-none"
                  placeholder="Enter the full script to generate images for each sentence..."
                />
              </div>
              {scenes.map((scene, index) => (
                <Scene
                  key={scene.id}
                  sceneNumber={scene.id}
                  voiceoverText={scene.voiceoverText}
                  onClose={() => scenes.length > 1 && removeScene(scene.id)}
                  onVoiceoverChange={(newText) => handleVoiceoverChange(scene.id, newText)}
                  artStyle={artStyle}
                  characterDescription={characterDescription}
                />
              ))}
              <button
                onClick={addScene}
                className="w-full py-3 bg-editor-secondary hover:bg-editor-hover rounded-lg text-editor-text flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Scene
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <FileBrowser />
        </div>
      </div>
    </div>
  );
};

export default Index;
