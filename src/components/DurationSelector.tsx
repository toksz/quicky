import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DurationSelectorProps {
  duration: number;
  setDuration: (duration: number) => void;
}

const DurationSelector = ({ duration, setDuration }: DurationSelectorProps) => {
  const [customDuration, setCustomDuration] = useState('');
  const presetDurations = [30, 60];

  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomDuration(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setDuration(numValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {presetDurations.map((d) => (
          <Button
            key={d}
            variant={duration === d ? "default" : "outline"}
            onClick={() => {
              setDuration(d);
              setCustomDuration('');
            }}
            className="w-24"
          >
            {d} Seconds
          </Button>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min="1"
          placeholder="Custom duration"
          value={customDuration}
          onChange={handleCustomDurationChange}
          className="w-32"
        />
        <span className="text-sm text-gray-500">seconds</span>
      </div>
    </div>
  );
};

export default DurationSelector;