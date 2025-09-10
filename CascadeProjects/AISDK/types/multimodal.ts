/**
 * @fileoverview Multimodal content and chat integration types
 * @description Types for mixed content display and multimodal conversations
 */

import { GeneratedImage, AnalyzedImage, StructuredImageAnalysis } from './images'
import { CitationSource } from './rag'

export interface MultimodalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: GeneratedImage[]
  analyzedImages?: AnalyzedImage[]
  citations?: CitationSource[]
  toolCalls?: ToolCall[]
  timestamp: Date
}

export interface ToolCall {
  id: string
  name: string
  parameters: Record<string, any>
  result?: any
  status: 'pending' | 'completed' | 'error'
  executionTime?: number
}

export interface MixedContentCard {
  id: string
  type: 'text' | 'image_generation' | 'image_analysis' | 'document_retrieval' | 'mixed'
  content: string
  images?: GeneratedImage[]
  analysis?: ImageAnalysisDisplay[]
  citations?: CitationSource[]
  metadata?: ContentMetadata
}

export interface ImageAnalysisDisplay {
  imageUrl: string
  analysis: StructuredImageAnalysis
  confidence: number
  processingTime?: number
}

export interface ContentMetadata {
  generatedAt: Date
  provider?: string
  cost?: number
  tokens?: {
    input: number
    output: number
  }
  processingTime?: number
}

export interface MultimodalConversation {
  id: string
  title: string
  messages: MultimodalMessage[]
  totalImages: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
  tags: string[]
}

export interface ConversationExport {
  conversation: MultimodalConversation
  embedImages: boolean
  format: 'json' | 'markdown' | 'html' | 'pdf'
  includeMetadata: boolean
}

export interface ImageReference {
  id: string
  url: string
  type: 'generated' | 'analyzed' | 'uploaded'
  context: string
  messageId: string
  relevanceScore?: number
}

export interface MultimodalContext {
  currentImages: ImageReference[]
  recentAnalysis: StructuredImageAnalysis[]
  activeProviders: string[]
  conversationHistory: string[]
  visualContext?: {
    dominantColors: string[]
    commonObjects: string[]
    overallMood: string
    visualThemes: string[]
  }
}

export interface GenerationProgress {
  id: string
  status: 'queued' | 'generating' | 'completed' | 'error'
  progress: number
  message: string
  estimatedTime?: number
  startedAt: Date
  completedAt?: Date
  error?: string
}

export interface AnalysisProgress {
  id: string
  status: 'uploading' | 'analyzing' | 'completed' | 'error'
  progress: number
  message: string
  startedAt: Date
  completedAt?: Date
  error?: string
}
