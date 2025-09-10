/**
 * @fileoverview OpenAI DALL-E 3 image generation integration
 * @description Handles image generation using OpenAI's DALL-E 3 model
 */

import { openai } from '@ai-sdk/openai'
import { experimental_generateImage as generateImage } from 'ai'
import { ImageGenerationRequest, ImageGenerationResult, ImageMetadata } from '@/types/images'

export interface OpenAIImageConfig {
  model: 'dall-e-3' | 'dall-e-2'
  apiKey: string
}

export const OPENAI_IMAGE_CONFIG: OpenAIImageConfig = {
  model: 'dall-e-3',
  apiKey: process.env.OPENAI_API_KEY || ''
}

/**
 * Generate image using OpenAI DALL-E 3
 */
export async function generateImageWithOpenAI(
  request: ImageGenerationRequest
): Promise<ImageGenerationResult> {
  try {
    if (!OPENAI_IMAGE_CONFIG.apiKey) {
      throw new Error('OpenAI API key is required for image generation')
    }

    console.log('🎨 Generating image with OpenAI DALL-E 3 via AI SDK:', {
      prompt: request.prompt.substring(0, 100) + '...',
      size: request.size,
      style: request.style,
      quality: request.quality,
      hasApiKey: !!OPENAI_IMAGE_CONFIG.apiKey
    })

    // Use AI SDK's experimental_generateImage function
    const result = await generateImage({
      model: openai.image(OPENAI_IMAGE_CONFIG.model),
      prompt: request.prompt,
      size: request.size || '1024x1024',
      providerOptions: {
        openai: { 
          style: request.style || 'vivid', 
          quality: request.quality || 'standard' 
        }
      }
    })

    // According to AI SDK docs, the result has an 'image' property with base64 data
    // We need to convert this to a data URL for display
    const imageBase64 = result.image.base64
    const imageUrl = `data:image/png;base64,${imageBase64}`
    
    // Create a shorter reference for the conversation context to avoid context length issues
    const imageReference = `[Generated image: ${request.prompt.substring(0, 50)}... - ${request.size || '1024x1024'}]`
    
    const imageId = `openai-${Date.now()}`
    
    // Get revised prompt from provider metadata if available
    const revisedPrompt = result.providerMetadata?.openai?.images?.[0]?.revisedPrompt

    const metadata: ImageMetadata = {
      id: imageId,
      url: imageUrl,
      prompt: request.prompt,
      revisedPrompt: revisedPrompt,
      provider: 'openai',
      size: request.size || '1024x1024',
      style: request.style,
      quality: request.quality,
      generatedAt: new Date(),
      model: OPENAI_IMAGE_CONFIG.model,
      cost: calculateOpenAICost(request.size, request.quality)
    }

    console.log('OpenAI image generated successfully via AI SDK:', {
      imageId,
      hasBase64: !!imageBase64,
      revisedPrompt: revisedPrompt?.substring(0, 100) + '...'
    })

    return {
      success: true,
      imageUrl: imageUrl,
      revisedPrompt: revisedPrompt,
      imageId,
      metadata
    }

  } catch (error) {
    console.error('OpenAI image generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Image generation failed'
    }
  }
}

/**
 * Calculate cost for OpenAI image generation
 */
function calculateOpenAICost(size?: string, quality?: string): number {
  // DALL-E 3 pricing (as of 2024)
  const pricing = {
    'standard': {
      '1024x1024': 0.040,
      '1792x1024': 0.080,
      '1024x1792': 0.080
    },
    'hd': {
      '1024x1024': 0.080,
      '1792x1024': 0.120,
      '1024x1792': 0.120
    }
  }

  const qualityKey = quality || 'standard'
  const sizeKey = size || '1024x1024'
  
  return pricing[qualityKey as keyof typeof pricing]?.[sizeKey as keyof typeof pricing.standard] || 0.040
}

/**
 * Get OpenAI provider capabilities
 */
export function getOpenAICapabilities() {
  return {
    imageGeneration: true,
    imageAnalysis: true, // GPT-4 Vision
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
    supportedStyles: ['vivid', 'natural'],
    supportedQualities: ['standard', 'hd'],
    maxPromptLength: 4000,
    batchProcessing: false
  }
}

/**
 * Get OpenAI provider limits
 */
export function getOpenAILimits() {
  return {
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 200,
    maxImageSize: 4 * 1024 * 1024, // 4MB
    maxBatchSize: 1
  }
}
