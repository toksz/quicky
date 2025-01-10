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
          <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
          <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GeminiModelSelector;