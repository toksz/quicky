import { Folder, File, Image, Video } from "lucide-react";

const mockFiles = [
  { id: 1, name: "Project Assets", type: "folder" },
  { id: 2, name: "intro.mp4", type: "video" },
  { id: 3, name: "background.jpg", type: "image" },
  { id: 4, name: "script.txt", type: "file" },
];

export const FileBrowser = () => {
  return (
    <div className="w-full bg-editor-secondary rounded-lg p-4 animate-fade-in">
      <h3 className="text-editor-text font-medium mb-4">Project Files</h3>
      <div className="space-y-2">
        {mockFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-2 hover:bg-editor-hover rounded-lg cursor-pointer transition-colors group"
          >
            {file.type === "folder" && (
              <Folder className="w-4 h-4 text-editor-accent" />
            )}
            {file.type === "video" && (
              <Video className="w-4 h-4 text-editor-accent" />
            )}
            {file.type === "image" && (
              <Image className="w-4 h-4 text-editor-accent" />
            )}
            {file.type === "file" && (
              <File className="w-4 h-4 text-editor-accent" />
            )}
            <span className="text-sm text-editor-text group-hover:text-editor-accent transition-colors">
              {file.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
