/**
 * @fileoverview Document processing and RAG-related type definitions
 * @description Types for document upload, processing, chunking, and metadata
 */

export interface Document {
  id: string
  title: string
  content: string
  source: 'pdf' | 'url' | 'text'
  metadata: DocumentMetadata
  chunks?: DocumentChunk[]
  status: 'processing' | 'completed' | 'error'
  createdAt: Date
  updatedAt: Date
}

export interface DocumentMetadata {
  filename?: string
  url?: string
  size?: number
  pageCount?: number
  author?: string
  description?: string
  language?: string
  processedAt: Date
  chunkCount?: number
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  index: number
  startIndex: number
  endIndex: number
  metadata: ChunkMetadata
  embedding?: number[]
  vectorId?: string
}

export interface ChunkMetadata {
  page?: number
  section?: string
  heading?: string
  wordCount: number
  charCount: number
  source: 'pdf' | 'url' | 'text'
  documentTitle: string
}

export interface DocumentProcessingResult {
  document: Document
  chunks: DocumentChunk[]
  success: boolean
  error?: string
  processingTime: number
}

export interface DocumentUploadProgress {
  documentId: string
  status: 'uploading' | 'processing' | 'embedding' | 'storing' | 'completed' | 'error'
  progress: number
  message: string
  error?: string
}

export interface DocumentLibraryFilters {
  source?: 'pdf' | 'url' | 'text'
  dateRange?: {
    start: Date
    end: Date
  }
  searchQuery?: string
}

export interface DocumentStats {
  totalDocuments: number
  totalChunks: number
  storageUsed: number
  lastUpdated: Date
}
