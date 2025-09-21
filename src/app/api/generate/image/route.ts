import { NextRequest, NextResponse } from "next/server";

// Available image models for the studio
const SUPPORTED_MODELS = {
  "gpt-image-1": {
    name: "gpt-image-1",
    description: "Advanced image generation and editing model",
    supportsModes: ["text-to-image", "image-to-image", "image-editing"]
  },
  "flux-pro": {
    name: "flux-pro/ultra", 
    description: "Fast and stable image generation",
    supportsModes: ["text-to-image"]
  },
  "imagen4": {
    name: "imagen4",
    description: "Latest high quality image generation model",
    supportsModes: ["text-to-image"]
  },
  "recraft-v3": {
    name: "recraft-v3", 
    description: "Realistic image generation",
    supportsModes: ["text-to-image"]
  },
  "ideogram": {
    name: "ideogram/V_3",
    description: "Character reference specialist with facial consistency",
    supportsModes: ["text-to-image", "character-consistency"]
  }
};

interface GenerateImageRequest {
  prompt: string;
  model: string;
  aspectRatio?: string;
  imageUrls?: string[];
  highDetail?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json();
    const { prompt, model = "flux-pro", aspectRatio = "1:1", imageUrls = [] } = body;

    // Validate inputs
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Determine the actual model to use
    let actualModel = "flux-pro/ultra"; // Default fallback
    
    if (model.includes("gemini")) {
      // For Gemini models, use flux-pro as they're not available in our generation API
      actualModel = "flux-pro/ultra";
    } else if (SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS]) {
      actualModel = SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS].name;
    }

    // Prepare generation parameters
    const generationParams = {
      query: prompt,
      model: actualModel,
      aspect_ratio: aspectRatio,
      image_urls: imageUrls,
      task_summary: `Generate image: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`
    };

    console.log(`Starting image generation with model: ${actualModel}`);
    console.log(`Prompt: ${prompt}`);
    console.log(`Aspect ratio: ${aspectRatio}`);
    console.log(`Reference images: ${imageUrls.length}`);

    // For this implementation, we'll simulate the generation process
    // In a real scenario, you would call an external API or use Claude's image_generation tool
    // But since we're in the API route context, we'll return structured data for the frontend to handle

    return NextResponse.json({
      success: true,
      data: {
        model: actualModel,
        prompt,
        aspectRatio,
        imageUrls,
        generationParams,
        estimatedTime: "30-60 seconds",
        message: "Generation request prepared successfully"
      }
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to process image generation request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    models: SUPPORTED_MODELS,
    supportedAspectRatios: ["1:1", "4:3", "16:9", "9:16", "3:4"],
    maxPromptLength: 1000,
    maxReferenceImages: 4
  });
}