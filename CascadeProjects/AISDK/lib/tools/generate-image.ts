/**
 * @fileoverview AI tool for generating images from text descriptions
 * @description Integrates with multiple providers for image generation
 */

import { tool } from 'ai'
import { z } from 'zod'
import { generateImageWithProvider, getDefaultProvider } from '@/lib/images/providers/provider-registry'
import { ImageGenerationRequest } from '@/types/images'

/**
 * Image generation tool for AI SDK
 */
export const generateImageTool = tool({
  description: 'Generate an image from a text description using AI. Supports multiple providers and styles.',
  inputSchema: z.object({
    prompt: z.string().min(1).describe('Detailed description of the image to generate'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional().describe('Image dimensions (default: 1024x1024)'),
    style: z.enum(['vivid', 'natural']).optional().describe('Image style - vivid for dramatic/artistic, natural for realistic (default: vivid)'),
    quality: z.enum(['standard', 'hd']).optional().describe('Image quality - hd costs more but higher resolution (default: standard)'),
    provider: z.enum(['openai', 'replicate']).optional().describe('AI provider to use (default: best available)')
  }),
  execute: async ({ prompt, size = '1024x1024', style = 'vivid', quality = 'standard', provider }) => {
    console.log('🎨 Image generation tool STARTED:', { 
      prompt: prompt.substring(0, 100) + '...',
      size, 
      style, 
      quality,
      provider 
    })

    try {
      // Use specified provider or default to best available
      const selectedProvider = provider || getDefaultProvider()
      
      if (!selectedProvider) {
        return {
          success: false,
          error: 'No image generation providers are available. Please check API key configuration.',
          prompt
        }
      }

      const request: ImageGenerationRequest = {
        prompt,
        size,
        style,
        quality,
        provider: selectedProvider
      }

      const result = await generateImageWithProvider(selectedProvider, request)

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Image generation failed',
          prompt,
          provider: selectedProvider
        }
      }

      console.log('🎨 Image generated successfully:', {
        imageId: result.imageId,
        provider: selectedProvider,
        cost: result.metadata?.cost,
        hasImageUrl: !!result.imageUrl
      })

      // Create a context-friendly response that won't exceed token limits
      const toolResult = {
        success: true,
        imageUrl: result.imageUrl, // Keep full URL for UI display
        imageId: result.imageId,
        // Use shorter text for context to avoid token limit issues
        contextSummary: `Generated ${size} image using ${selectedProvider}: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`,
        revisedPrompt: result.revisedPrompt?.substring(0, 200) + (result.revisedPrompt?.length > 200 ? '...' : ''),
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
        provider: selectedProvider,
        metadata: {
          size,
          style,
          quality,
          generatedAt: new Date().toISOString(),
          cost: result.metadata?.cost,
          model: result.metadata?.model
        }
      }
      
      console.log('🎨 Tool result being returned:', toolResult)
      return toolResult

    } catch (error) {
      console.error('🎨 Image generation ERROR:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        prompt,
        provider
      }
    }
  }
})
