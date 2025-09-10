/**
 * @fileoverview Image generation and analysis type definitions
 * @description Types for multimodal AI capabilities including generation and vision
 */

export interface ImageGenerationRequest {
  prompt: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  style?: 'vivid' | 'natural'
  quality?: 'standard' | 'hd'
  provider?: 'openai' | 'replicate'
}

export interface ImageGenerationResult {
  success: boolean
  imageUrl?: string
  revisedPrompt?: string
  imageId?: string
  error?: string
  metadata?: ImageMetadata
}

export interface ImageMetadata {
  id: string
  url: string
  prompt: string
  revisedPrompt?: string
  provider: 'openai' | 'replicate'
  size: string
  style?: string
  quality?: string
  generatedAt: Date
  cost?: number
  model?: string
}

export interface ImageAnalysisRequest {
  imageUrl: string
  detailLevel?: 'low' | 'high'
  includeText?: boolean
  generateTags?: boolean
}

export interface ImageAnalysisResult {
  success: boolean
  analysis?: StructuredImageAnalysis
  imageUrl: string
  error?: string
}

export interface StructuredImageAnalysis {
  description: string
  objects: string[]
  colors: string[]
  mood: string
  style: string
  text: string[]
  tags: string[]
  confidence: number
  analysisMetadata: {
    model: string
    detailLevel: 'low' | 'high'
    analyzedAt: Date
  }
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  revisedPrompt?: string
  provider: 'openai' | 'replicate'
  size: string
  style?: string
  generatedAt: Date
  thumbnailUrl?: string
  downloadUrl?: string
}

export interface AnalyzedImage {
  id: string
  url: string
  originalFilename?: string
  analysis: StructuredImageAnalysis
  uploadedAt: Date
  size?: number
  mimeType?: string
}

export interface ImageGalleryItem {
  id: string
  type: 'generated' | 'analyzed' | 'uploaded'
  url: string
  thumbnailUrl?: string
  title?: string
  description?: string
  tags: string[]
  createdAt: Date
  metadata?: ImageMetadata | StructuredImageAnalysis
}

export interface ImageGalleryFilters {
  type?: 'generated' | 'analyzed' | 'uploaded'
  provider?: 'openai' | 'replicate'
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  searchQuery?: string
}

export interface ImageUploadProgress {
  imageId: string
  status: 'uploading' | 'analyzing' | 'completed' | 'error'
  progress: number
  message: string
  error?: string
}
