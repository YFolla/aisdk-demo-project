/**
 * @fileoverview Image generation API endpoint
 * @description Handles image generation requests using multiple providers
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateImageWithProvider, getDefaultProvider } from '@/lib/images/providers/provider-registry'
import { ImageGenerationRequest } from '@/types/images'

export async function POST(req: NextRequest) {
  try {
    console.log('🎨 Image generation request received')
    
    const body = await req.json()
    const { 
      prompt, 
      size = '1024x1024', 
      style = 'vivid', 
      quality = 'standard',
      provider 
    } = body
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }
    
    if (prompt.length < 10) {
      return NextResponse.json(
        { error: 'Prompt must be at least 10 characters long' },
        { status: 400 }
      )
    }
    
    // Use specified provider or default to best available
    const selectedProvider = provider || getDefaultProvider()
    
    if (!selectedProvider) {
      return NextResponse.json(
        { error: 'No image generation providers are available. Please check API key configuration.' },
        { status: 503 }
      )
    }
    
    console.log('🎨 Generating image:', {
      prompt: prompt.substring(0, 100) + '...',
      provider: selectedProvider,
      size,
      style,
      quality
    })
    
    const request: ImageGenerationRequest = {
      prompt,
      size,
      style,
      quality,
      provider: selectedProvider
    }
    
    const result = await generateImageWithProvider(selectedProvider, request)
    
    if (!result.success) {
      console.error('❌ Image generation failed:', result.error)
      return NextResponse.json(
        { 
          error: result.error || 'Image generation failed',
          provider: selectedProvider
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Image generated successfully:', {
      imageId: result.imageId,
      provider: selectedProvider,
      cost: result.metadata?.cost
    })
    
    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      imageId: result.imageId,
      revisedPrompt: result.revisedPrompt,
      provider: selectedProvider,
      metadata: result.metadata
    })
    
  } catch (error) {
    console.error('❌ Image generation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to generate image'
      },
      { status: 500 }
    )
  }
}
