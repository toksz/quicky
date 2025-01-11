import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X } from 'lucide-react';

export interface KeywordTiming {
  id: string;
  keyword: string;
  duration: number;
}

interface KeywordManagerProps {
  keywords: KeywordTiming[];
  setKeywords: (keywords: KeywordTiming[]) => void;
  totalDuration: number;
  targetDuration: number;
}

const KeywordManager = ({ keywords, setKeywords, totalDuration, targetDuration }: KeywordManagerProps) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [newDuration, setNewDuration] = useState(5);

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const newItem: KeywordTiming = {
        id: Date.now().toString(),
        keyword: newKeyword.trim(),
        duration: newDuration
      };
      setKeywords([...keywords, newItem]);
      setNewKeyword('');
      setNewDuration(5);
    }
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(keywords);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setKeywords(items);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Enter keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          min="1"
          max="30"
          value={newDuration}
          onChange={(e) => setNewDuration(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={addKeyword}>Add</Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total Duration: {totalDuration}s / {targetDuration}s</span>
          <span>{keywords.length} keywords</span>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="keywords">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {keywords.map((keyword, index) => (
                  <Draggable key={keyword.id} draggableId={keyword.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center gap-2 p-2 bg-gray-100 rounded-md"
                      >
                        <span className="flex-1">{keyword.keyword}</span>
                        <span className="text-sm text-gray-500">{keyword.duration}s</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyword(keyword.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Card>
  );
};

export default KeywordManager;