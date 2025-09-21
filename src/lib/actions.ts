'use server';

import { 
  ImageGenerationParams, 
  VideoGenerationParams, 
  GenerationResult,
  validateImageParams,
  validateVideoParams
} from './ai-generation';
import { 
  callImageGenerationTool,
  callVideoGenerationTool
} from './real-ai-generation';

// Server action for image generation that can access AI tools
export async function generateImageAction(params: ImageGenerationParams): Promise<GenerationResult> {
  try {
    // Validate parameters
    const errors = validateImageParams(params);
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(', ')
      };
    }

    console.log('Server action: Image generation started', {
      model: params.model,
      prompt: params.prompt.substring(0, 100) + '...',
      aspectRatio: params.aspectRatio
    });

    // Call the real AI generation system
    const result = await callImageGenerationTool(params);
    
    console.log('Server action: Image generation completed', {
      success: result.success,
      hasUrl: !!result.data?.url,
      model: params.model
    });
    
    return result;

  } catch (error) {
    console.error('Server action: Image generation failed', error);
    return {
      success: false,
      error: 'Image generation failed. Please try again.'
    };
  }
}

// Server action for video generation that can access AI tools
export async function generateVideoAction(params: VideoGenerationParams): Promise<GenerationResult> {
  try {
    // Validate parameters
    const errors = validateVideoParams(params);
    if (errors.length > 0) {
      return {
        success: false,
        error: errors.join(', ')
      };
    }

    console.log('Server action: Video generation started', {
      model: params.model,
      prompt: params.prompt.substring(0, 100) + '...',
      duration: params.duration,
      aspectRatio: params.aspectRatio
    });

    // Call the real AI generation system
    const result = await callVideoGenerationTool(params);
    
    console.log('Server action: Video generation completed', {
      success: result.success,
      hasUrl: !!result.data?.url,
      duration: params.duration,
      model: params.model
    });
    
    return result;

  } catch (error) {
    console.error('Server action: Video generation failed', error);
    return {
      success: false,
      error: 'Video generation failed. Please try again.'
    };
  }
}

// Helper action to get available models
export async function getAvailableModelsAction() {
  return {
    image: {
      "flux-pro": "FLUX Pro - Fast and stable",
      "gpt-image-1": "GPT Image - Advanced editing",
      "imagen4": "Imagen 4 - Latest Google model",
      "recraft-v3": "Recraft V3 - Realistic images"
    },
    video: {
      "kling-v2": "Kling V2 - Advanced video generation",
      "gemini-veo2": "Gemini Veo 2 - Fast high-quality",
      "gemini-veo3": "Gemini Veo 3 - Latest with sound",
      "hunyuan": "Hunyuan - High quality"
    }
  };
}