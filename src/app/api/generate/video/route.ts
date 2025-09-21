import { NextRequest, NextResponse } from "next/server";

// Available video models for the studio
const SUPPORTED_MODELS = {
  "kling-v2": {
    name: "kling/v2.1/standard",
    description: "Advanced video generation, image-to-video support",
    maxDuration: 10,
    aspectRatios: ["16:9", "9:16", "1:1"]
  },
  "gemini-veo2": {
    name: "gemini/veo2", 
    description: "Fast high-quality video generation",
    maxDuration: 8,
    aspectRatios: ["16:9", "9:16"]
  },
  "gemini-veo3": {
    name: "gemini/veo3",
    description: "Latest video generation with sound support",
    maxDuration: 8,
    aspectRatios: ["16:9", "9:16"]
  },
  "minimax-hailuo": {
    name: "minimax/hailuo-02/standard",
    description: "High-quality video with first & last frame control",
    maxDuration: 10,
    aspectRatios: ["16:9", "9:16"]
  },
  "hunyuan": {
    name: "hunyuan",
    description: "High quality video generation",
    maxDuration: 5,
    aspectRatios: ["16:9", "9:16"]
  }
};

interface GenerateVideoRequest {
  prompt: string;
  model: string;
  duration: number;
  aspectRatio?: string;
  startImage?: string;
  narration?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateVideoRequest = await request.json();
    const { 
      prompt, 
      model = "kling-v2", 
      duration = 5, 
      aspectRatio = "16:9", 
      startImage,
      narration 
    } = body;

    // Validate inputs
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Determine the actual model to use
    let actualModel = "kling/v2.1/standard"; // Default fallback
    let maxDuration = 10;
    let supportedRatios = ["16:9", "9:16", "1:1"];

    if (SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS]) {
      const modelConfig = SUPPORTED_MODELS[model as keyof typeof SUPPORTED_MODELS];
      actualModel = modelConfig.name;
      maxDuration = modelConfig.maxDuration;
      supportedRatios = modelConfig.aspectRatios;
    }

    // Validate duration
    const sanitizedDuration = Math.min(Math.max(1, duration), maxDuration);

    // Validate aspect ratio
    if (!supportedRatios.includes(aspectRatio)) {
      return NextResponse.json(
        { error: `Aspect ratio ${aspectRatio} not supported for model ${actualModel}` },
        { status: 400 }
      );
    }

    // Prepare generation parameters
    const generationParams = {
      query: prompt,
      model: actualModel,
      duration: sanitizedDuration,
      aspect_ratio: aspectRatio,
      image_urls: startImage ? [startImage] : [],
      task_summary: `Generate ${sanitizedDuration}s video: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`
    };

    // Add narration to prompt if provided
    let finalPrompt = prompt;
    if (narration && narration.trim()) {
      finalPrompt = `${prompt}\n\nNarration guide: ${narration}`;
    }
    generationParams.query = finalPrompt;

    console.log(`Starting video generation with model: ${actualModel}`);
    console.log(`Duration: ${sanitizedDuration}s`);
    console.log(`Prompt: ${finalPrompt}`);
    console.log(`Aspect ratio: ${aspectRatio}`);
    console.log(`Start image: ${startImage ? 'Yes' : 'No'}`);

    // Calculate estimated cost (using the existing pricing logic)
    const estimatedCost = sanitizedDuration * 0.0333; // $0.0333 per second as per pricing.ts

    return NextResponse.json({
      success: true,
      data: {
        model: actualModel,
        prompt: finalPrompt,
        duration: sanitizedDuration,
        aspectRatio,
        startImage,
        narration,
        generationParams,
        estimatedCost,
        estimatedTime: "2-5 minutes",
        message: "Video generation request prepared successfully"
      }
    });

  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Failed to process video generation request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    models: SUPPORTED_MODELS,
    defaultDuration: 5,
    maxDuration: 30,
    supportedAspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    maxPromptLength: 1000,
    costPerSecond: 0.0333
  });
}