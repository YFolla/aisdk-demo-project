/**
 * @fileoverview RAG (Retrieval-Augmented Generation) type definitions
 * @description Types for vector operations, embeddings, and retrieval
 */

export interface EmbeddingConfig {
  model: 'text-embedding-3-small' | 'text-embedding-3-large' | 'text-embedding-ada-002'
  dimensions: number
  maxTokens: number
}

export interface VectorSearchResult {
  id: string
  score: number
  metadata: VectorMetadata
  content: string
}

export interface VectorMetadata {
  documentId: string
  chunkId: string
  documentTitle: string
  source: 'pdf' | 'url' | 'text'
  page?: number
  section?: string
  wordCount: number
  createdAt: string
}

export interface RetrievalContext {
  query: string
  results: VectorSearchResult[]
  totalResults: number
  searchTime: number
  threshold: number
  maxResults: number
}

export interface RAGResponse {
  answer: string
  sources: CitationSource[]
  context: RetrievalContext
  confidence: number
}

export interface CitationSource {
  id: string
  title: string
  content: string
  page?: number
  section?: string
  url?: string
  relevanceScore: number
}

export interface EmbeddingRequest {
  text: string
  model?: string
}

export interface EmbeddingResponse {
  embedding: number[]
  model: string
  usage: {
    promptTokens: number
    totalTokens: number
  }
}

export interface PineconeConfig {
  indexName: string
  environment: string
  dimensions: 1536 // text-embedding-3-small
  metric: 'cosine' | 'euclidean' | 'dotproduct'
  namespace?: string
}

export interface DocumentRetrievalOptions {
  query: string
  topK?: number
  threshold?: number
  namespace?: string
  filter?: Record<string, any>
  includeMetadata?: boolean
  includeValues?: boolean
}
