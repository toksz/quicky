import { Scissors, Type, Image, Music, Layers } from "lucide-react";

const tools = [
  { id: 1, name: "Cut", icon: Scissors },
  { id: 2, name: "Text", icon: Type },
  { id: 3, name: "Media", icon: Image },
  { id: 4, name: "Audio", icon: Music },
  { id: 5, name: "Layers", icon: Layers },
];

export const ToolsPanel = () => {
  return (
    <div className="flex flex-col gap-2 bg-editor-secondary p-2 rounded-lg animate-fade-in">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className="p-2 hover:bg-editor-hover rounded-lg transition-all hover:scale-105 group"
        >
          <tool.icon className="w-5 h-5 text-editor-text group-hover:text-editor-accent transition-colors" />
        </button>
      ))}
    </div>
  );
};
