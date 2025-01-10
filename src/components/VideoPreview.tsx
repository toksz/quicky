import { PixabayVideo } from '@/lib/pixabay';
import { Card } from '@/components/ui/card';

interface VideoPreviewProps {
  videos: PixabayVideo[];
}

const VideoPreview = ({ videos }: VideoPreviewProps) => {
  if (!videos.length) return null;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Selected Videos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="space-y-2">
            <video
              src={video.videos.small.url}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: '200px' }}
            >
              Your browser does not support the video tag.
            </video>
            <p className="text-sm text-gray-500">Duration: {video.duration}s</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VideoPreview;