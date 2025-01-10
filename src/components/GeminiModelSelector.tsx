import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeminiModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
}

const GeminiModelSelector = ({ model, setModel }: GeminiModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Gemini Model</label>
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model" />
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
  );
};

export default GeminiModelSelector;