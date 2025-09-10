/**
 * @fileoverview GPT-4 Vision integration for image analysis
 * @description Handles image analysis using OpenAI's GPT-4 Vision model
 */

import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { ImageAnalysisRequest, ImageAnalysisResult, StructuredImageAnalysis } from '@/types/images'

export const GPT4_VISION_CONFIG = {
  model: 'gpt-4o', // GPT-4o has vision capabilities
  maxTokens: 1000,
  temperature: 0.1
}

/**
 * Schema for structured image analysis output
 */
const ImageAnalysisSchema = z.object({
  description: z.string().describe('Detailed description of the image content'),
  objects: z.array(z.string()).describe('List of objects, people, or items visible in the image'),
  colors: z.array(z.string()).describe('Dominant colors in the image'),
  mood: z.string().describe('Overall mood or atmosphere of the image'),
  style: z.string().describe('Artistic style, photography type, or visual characteristics'),
  text: z.array(z.string()).describe('Any text visible in the image'),
  tags: z.array(z.string()).describe('Relevant tags or keywords for the image'),
  confidence: z.number().min(0).max(1).describe('Confidence score for the analysis')
})

/**
 * Analyze image using GPT-4 Vision with structured output
 */
export async function analyzeImageWithGPT4Vision(
  request: ImageAnalysisRequest
): Promise<ImageAnalysisResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required for image analysis')
    }

    console.log('Analyzing image with GPT-4 Vision:', {
      imageUrl: request.imageUrl.substring(0, 50) + '...',
      detailLevel: request.detailLevel,
      includeText: request.includeText,
      generateTags: request.generateTags
    })

    const systemPrompt = `You are an expert image analyst. Analyze the provided image and return a structured analysis with the following requirements:

1. Provide a detailed, accurate description of what you see
2. List all visible objects, people, animals, or significant items
3. Identify the dominant colors in the image
4. Describe the overall mood, atmosphere, or emotional tone
5. Identify the artistic style, photography type, or visual characteristics
${request.includeText ? '6. Extract any text visible in the image' : ''}
${request.generateTags ? '7. Generate relevant tags for categorization and search' : ''}

Be precise, objective, and comprehensive in your analysis. Provide a confidence score based on image clarity and your certainty about the analysis.`

    const userPrompt = `Please analyze this image in ${request.detailLevel || 'high'} detail.`

    const result = await generateObject({
      model: openai(GPT4_VISION_CONFIG.model),
      schema: ImageAnalysisSchema,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt
            },
            {
              type: 'image',
              image: request.imageUrl
            }
          ]
        }
      ],
      temperature: GPT4_VISION_CONFIG.temperature,
      maxTokens: GPT4_VISION_CONFIG.maxTokens
    })

    const structuredAnalysis: StructuredImageAnalysis = {
      ...result.object,
      analysisMetadata: {
        model: GPT4_VISION_CONFIG.model,
        detailLevel: request.detailLevel || 'high',
        analyzedAt: new Date()
      }
    }

    console.log('GPT-4 Vision analysis completed:', {
      objectsFound: structuredAnalysis.objects.length,
      tagsGenerated: structuredAnalysis.tags.length,
      confidence: structuredAnalysis.confidence
    })

    return {
      success: true,
      analysis: structuredAnalysis,
      imageUrl: request.imageUrl
    }

  } catch (error) {
    console.error('GPT-4 Vision analysis error:', error)
    return {
      success: false,
      imageUrl: request.imageUrl,
      error: error instanceof Error ? error.message : 'Image analysis failed'
    }
  }
}

/**
 * Batch analyze multiple images
 */
export async function batchAnalyzeImages(
  requests: ImageAnalysisRequest[]
): Promise<ImageAnalysisResult[]> {
  console.log(`Starting batch analysis of ${requests.length} images`)
  
  const results: ImageAnalysisResult[] = []
  
  // Process images sequentially to avoid rate limits
  for (const request of requests) {
    try {
      const result = await analyzeImageWithGPT4Vision(request)
      results.push(result)
      
      // Small delay between requests to respect rate limits
      if (requests.indexOf(request) < requests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Failed to analyze image ${request.imageUrl}:`, error)
      results.push({
        success: false,
        imageUrl: request.imageUrl,
        error: error instanceof Error ? error.message : 'Analysis failed'
      })
    }
  }
  
  console.log(`Batch analysis completed: ${results.filter(r => r.success).length}/${results.length} successful`)
  return results
}

/**
 * Extract text from image using GPT-4 Vision
 */
export async function extractTextFromImage(imageUrl: string): Promise<string[]> {
  try {
    const result = await analyzeImageWithGPT4Vision({
      imageUrl,
      detailLevel: 'high',
      includeText: true,
      generateTags: false
    })
    
    return result.success ? result.analysis?.text || [] : []
  } catch (error) {
    console.error('Text extraction error:', error)
    return []
  }
}

/**
 * Calculate cost for GPT-4 Vision analysis
 */
export function calculateVisionCost(detailLevel: 'low' | 'high' = 'high'): number {
  // GPT-4 Vision pricing (approximate)
  return detailLevel === 'high' ? 0.01 : 0.005
}
