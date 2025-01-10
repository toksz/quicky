const PIXABAY_API_KEY = ''; // We'll need to get this from environment variables

export interface PixabayVideo {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  duration: number;
  picture_id: string;
  videos: {
    large: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    medium: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    small: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
  };
}

export const searchVideos = async (query: string): Promise<PixabayVideo[]> => {
  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
        query
      )}&per_page=10`
    );
    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};