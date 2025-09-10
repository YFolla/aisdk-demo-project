/**
 * @fileoverview Image provider registry and management
 * @description Unified interface for managing multiple image generation providers
 */

import { ImageGenerationRequest, ImageGenerationResult } from '@/types/images'
import { ImageProvider } from '@/types/providers'
import { generateImageWithOpenAI, getOpenAICapabilities, getOpenAILimits } from './openai-images'
import { generateImageWithReplicate, getReplicateCapabilities, getReplicateLimits } from './replicate'

export type SupportedProvider = 'openai' | 'replicate'

/**
 * Registry of available image providers
 */
export const IMAGE_PROVIDERS: Record<SupportedProvider, ImageProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI DALL-E 3',
    description: 'High-quality image generation with natural language understanding',
    capabilities: getOpenAICapabilities(),
    pricing: {
      imageGeneration: {
        standard: 0.040,
        hd: 0.080,
        currency: 'USD',
        unit: 'per image'
      }
    },
    limits: getOpenAILimits(),
    models: [
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        description: 'Latest OpenAI image generation model with improved prompt following',
        type: 'generation',
        isDefault: true
      }
    ],
    isAvailable: !!process.env.OPENAI_API_KEY,
    status: 'active'
  },
  
  replicate: {
    id: 'replicate',
    name: 'Replicate SDXL',
    description: 'Stable Diffusion XL for diverse artistic styles and high-resolution images',
    capabilities: getReplicateCapabilities(),
    pricing: {
      imageGeneration: {
        standard: 0.003,
        hd: 0.005,
        currency: 'USD',
        unit: 'per image'
      }
    },
    limits: getReplicateLimits(),
    models: [
      {
        id: 'stability-ai/sdxl',
        name: 'Stable Diffusion XL',
        description: 'High-resolution image generation with artistic flexibility',
        type: 'generation',
        isDefault: true
      }
    ],
    isAvailable: !!process.env.REPLICATE_API_TOKEN,
    status: 'active'
  }
}

/**
 * Get available image providers
 */
export function getAvailableProviders(): ImageProvider[] {
  return Object.values(IMAGE_PROVIDERS).filter(provider => provider.isAvailable)
}

/**
 * Get specific provider by ID
 */
export function getProvider(providerId: SupportedProvider): ImageProvider | null {
  return IMAGE_PROVIDERS[providerId] || null
}

/**
 * Generate image using specified provider
 */
export async function generateImageWithProvider(
  providerId: SupportedProvider,
  request: ImageGenerationRequest
): Promise<ImageGenerationResult> {
  const provider = getProvider(providerId)
  
  if (!provider) {
    return {
      success: false,
      error: `Provider '${providerId}' not found`
    }
  }
  
  if (!provider.isAvailable) {
    return {
      success: false,
      error: `Provider '${providerId}' is not available. Check API key configuration.`
    }
  }
  
  try {
    switch (providerId) {
      case 'openai':
        return await generateImageWithOpenAI(request)
      
      case 'replicate':
        return await generateImageWithReplicate(request)
      
      default:
        return {
          success: false,
          error: `Unsupported provider: ${providerId}`
        }
    }
  } catch (error) {
    console.error(`Error generating image with ${providerId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Get default provider (first available)
 */
export function getDefaultProvider(): SupportedProvider | null {
  const available = getAvailableProviders()
  console.log('🎨 Available providers:', available.map(p => ({ id: p.id, isAvailable: p.isAvailable })))
  const result = available.length > 0 ? available[0].id : null
  console.log('🎨 Default provider selected:', result)
  return result
}

/**
 * Validate provider configuration
 */
export function validateProviderConfig(providerId: SupportedProvider): boolean {
  switch (providerId) {
    case 'openai':
      return !!process.env.OPENAI_API_KEY
    case 'replicate':
      return !!process.env.REPLICATE_API_TOKEN
    default:
      return false
  }
}

/**
 * Get provider status summary
 */
export function getProviderStatus() {
  return Object.entries(IMAGE_PROVIDERS).map(([id, provider]) => ({
    id,
    name: provider.name,
    isAvailable: provider.isAvailable,
    status: provider.status,
    capabilities: provider.capabilities
  }))
}
