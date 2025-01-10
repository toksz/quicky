const PIXABAY_API_KEY = ''; // We'll get this from localStorage

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
  const apiKey = localStorage.getItem('pixabay_api_key');
  if (!apiKey) {
    throw new Error('Pixabay API key not found');
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(
        query
      )}&per_page=3`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pixabay API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.hits || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

export const testPixabayConnection = async (): Promise<boolean> => {
  const apiKey = localStorage.getItem('pixabay_api_key');
  if (!apiKey) return false;

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=test&per_page=3`
    );
    const data = await response.json();
    return !data.error;
  } catch {
    return false;
  }
};