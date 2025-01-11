import { Button } from '@/components/ui/button';

interface FormatSelectorProps {
  format: 'portrait' | 'landscape';
  setFormat: (format: 'portrait' | 'landscape') => void;
}

const FormatSelector = ({ format, setFormat }: FormatSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Video Format</h3>
      <div className="flex gap-2">
        <Button
          variant={format === 'portrait' ? "default" : "outline"}
          onClick={() => setFormat('portrait')}
          className="w-32"
        >
          Portrait (9:16)
        </Button>
        <Button
          variant={format === 'landscape' ? "default" : "outline"}
          onClick={() => setFormat('landscape')}
          className="w-32"
        >
          Landscape (16:9)
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        {format === 'portrait' ? 'Perfect for Shorts & TikTok' : 'Standard YouTube format'}
      </p>
    </div>
  );
};

export default FormatSelector;