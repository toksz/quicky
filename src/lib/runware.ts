export interface GenerateImageParams {
  positivePrompt: string;
  numberResults?: number;
  CFGScale?: number;
  scheduler?: string;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed?: number;
  NSFWContent?: boolean;
}

export class RunwareService {
  constructor(apiKey: string) {
    // API key not needed for Pollinations.AI but keeping constructor for compatibility
  }

  async generateImage(params: GenerateImageParams): Promise<GeneratedImage> {
    const encodedPrompt = encodeURIComponent(params.positivePrompt);
    const imageURL = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
    
    // Return the image URL immediately since Pollinations.AI generates on demand
    return {
      imageURL,
      positivePrompt: params.positivePrompt,
    };
  }
}
