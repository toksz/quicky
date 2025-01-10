import { Button } from '@/components/ui/button';

interface DurationSelectorProps {
  duration: number;
  setDuration: (duration: number) => void;
}

const DurationSelector = ({ duration, setDuration }: DurationSelectorProps) => {
  const durations = [30, 60];

  return (
    <div className="flex gap-2">
      {durations.map((d) => (
        <Button
          key={d}
          variant={duration === d ? "default" : "outline"}
          onClick={() => setDuration(d)}
          className="w-24"
        >
          {d} Seconds
        </Button>
      ))}
    </div>
  );
};

export default DurationSelector;