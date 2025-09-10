/**
 * @fileoverview AI tool for analyzing and describing images
 * @description Uses GPT-4 Vision for structured image analysis
 */

import { tool } from 'ai'
import { z } from 'zod'
import { analyzeImageWithGPT4Vision } from '@/lib/vision/gpt4-vision'
import { ImageAnalysisRequest } from '@/types/images'

/**
 * Image analysis tool for AI SDK
 */
export const describeImageTool = tool({
  description: 'Analyze an image and provide detailed description with structured tags and metadata. Can extract text and identify objects, colors, mood, and style.',
  inputSchema: z.object({
    imageUrl: z.string().url().describe('URL of the image to analyze'),
    detailLevel: z.enum(['low', 'high']).optional().describe('Analysis detail level - high provides more comprehensive analysis (default: high)'),
    includeText: z.boolean().optional().describe('Whether to extract any text visible in the image (default: true)'),
    generateTags: z.boolean().optional().describe('Whether to generate searchable tags for the image (default: true)')
  }),
  execute: async ({ imageUrl, detailLevel = 'high', includeText = true, generateTags = true }) => {
    console.log('Image analysis tool executed:', {
      imageUrl: imageUrl.substring(0, 50) + '...',
      detailLevel,
      includeText,
      generateTags
    })

    try {
      const request: ImageAnalysisRequest = {
        imageUrl,
        detailLevel,
        includeText,
        generateTags
      }

      const result = await analyzeImageWithGPT4Vision(request)

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Image analysis failed',
          imageUrl
        }
      }

      const analysis = result.analysis!

      console.log('Image analysis completed:', {
        objectsFound: analysis.objects.length,
        colorsIdentified: analysis.colors.length,
        tagsGenerated: analysis.tags.length,
        textExtracted: analysis.text.length,
        confidence: analysis.confidence
      })

      return {
        success: true,
        imageUrl,
        analysis: {
          description: analysis.description,
          objects: analysis.objects,
          colors: analysis.colors,
          mood: analysis.mood,
          style: analysis.style,
          text: includeText ? analysis.text : [],
          tags: generateTags ? analysis.tags : [],
          confidence: analysis.confidence
        },
        metadata: {
          model: analysis.analysisMetadata.model,
          detailLevel: analysis.analysisMetadata.detailLevel,
          analyzedAt: analysis.analysisMetadata.analyzedAt.toISOString(),
          includeText,
          generateTags,
          processingTime: Date.now() - new Date(analysis.analysisMetadata.analyzedAt).getTime()
        }
      }

    } catch (error) {
      console.error('Image analysis error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        imageUrl
      }
    }
  }
})
