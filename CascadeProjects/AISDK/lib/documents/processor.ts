/**
 * @fileoverview Document processing service
 * @description Handles PDF parsing, text chunking, and content extraction
 */

// Import pdf-parse dynamically to avoid initialization issues
import { Document, DocumentChunk, DocumentProcessingResult, ChunkMetadata } from '@/types/documents'

export interface ChunkingOptions {
  chunkSize: number
  chunkOverlap: number
  minChunkSize: number
  preserveParagraphs: boolean
}

export const DEFAULT_CHUNKING_OPTIONS: ChunkingOptions = {
  chunkSize: 1000,
  chunkOverlap: 200,
  minChunkSize: 100,
  preserveParagraphs: true
}

/**
 * Process PDF buffer and extract text content
 */
export async function processPDF(
  buffer: Buffer,
  filename: string
): Promise<{ content: string; metadata: any }> {
  try {
    // Dynamic import to avoid initialization issues
    const { default: pdf } = await import('pdf-parse')
    
    // Use pdf-parse with the buffer directly
    const data = await pdf(buffer)
    
    return {
      content: data.text,
      metadata: {
        filename,
        pageCount: data.numpages,
        info: data.info,
        version: data.version
      }
    }
  } catch (error) {
    console.error('Error processing PDF:', error)
    throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Process text content from URL
 */
export async function processURL(url: string): Promise<{ content: string; metadata: any }> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('text/html')) {
      const html = await response.text()
      // Simple HTML text extraction (you might want to use cheerio for better parsing)
      const content = html
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      
      return {
        content,
        metadata: {
          url,
          contentType,
          title: html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || 'Untitled'
        }
      }
    } else if (contentType.includes('text/')) {
      const content = await response.text()
      return {
        content,
        metadata: {
          url,
          contentType
        }
      }
    } else {
      throw new Error(`Unsupported content type: ${contentType}`)
    }
  } catch (error) {
    console.error('Error processing URL:', error)
    throw new Error(`Failed to process URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Split text into chunks with overlap
 */
export function chunkText(
  text: string,
  options: Partial<ChunkingOptions> = {}
): DocumentChunk[] {
  const opts = { ...DEFAULT_CHUNKING_OPTIONS, ...options }
  const chunks: DocumentChunk[] = []
  
  if (!text.trim()) {
    return chunks
  }
  
  // Clean and normalize text
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  if (cleanText.length <= opts.chunkSize) {
    // Text is small enough to be a single chunk
    chunks.push(createChunk(cleanText, 0, 0, cleanText.length, 'text', 'Single Document'))
    return chunks
  }
  
  let startIndex = 0
  let chunkIndex = 0
  
  while (startIndex < cleanText.length) {
    let endIndex = Math.min(startIndex + opts.chunkSize, cleanText.length)
    
    // Try to end at a natural boundary if preserveParagraphs is true
    if (opts.preserveParagraphs && endIndex < cleanText.length) {
      // Look for paragraph break
      const paragraphEnd = cleanText.lastIndexOf('\n\n', endIndex)
      if (paragraphEnd > startIndex + opts.minChunkSize) {
        endIndex = paragraphEnd + 2
      } else {
        // Look for sentence end
        const sentenceEnd = cleanText.lastIndexOf('.', endIndex)
        if (sentenceEnd > startIndex + opts.minChunkSize) {
          endIndex = sentenceEnd + 1
        }
      }
    }
    
    const chunkContent = cleanText.slice(startIndex, endIndex).trim()
    
    if (chunkContent.length >= opts.minChunkSize) {
      chunks.push(createChunk(chunkContent, chunkIndex, startIndex, endIndex, 'text', 'Document'))
      chunkIndex++
    }
    
    // Calculate next start position with overlap
    const nextStart = Math.max(endIndex - opts.chunkOverlap, startIndex + opts.minChunkSize)
    if (nextStart >= endIndex) {
      break
    }
    startIndex = nextStart
  }
  
  return chunks
}

/**
 * Create a document chunk with metadata
 */
function createChunk(
  content: string,
  index: number,
  startIndex: number,
  endIndex: number,
  source: 'pdf' | 'url' | 'text',
  documentTitle: string
): DocumentChunk {
  return {
    id: `chunk-${Date.now()}-${index}`,
    documentId: '', // Will be set when associated with document
    content,
    index,
    startIndex,
    endIndex,
    metadata: {
      wordCount: content.split(/\s+/).length,
      charCount: content.length,
      source,
      documentTitle
    }
  }
}

/**
 * Process a complete document from various sources
 */
export async function processDocument(
  source: { type: 'pdf'; buffer: Buffer; filename: string } |
         { type: 'url'; url: string } |
         { type: 'text'; content: string; title: string },
  chunkingOptions?: Partial<ChunkingOptions>
): Promise<DocumentProcessingResult> {
  const startTime = Date.now()
  
  try {
    let content: string
    let metadata: any
    let documentSource: 'pdf' | 'url' | 'text'
    let title: string
    
    switch (source.type) {
      case 'pdf':
        const pdfResult = await processPDF(source.buffer, source.filename)
        content = pdfResult.content
        metadata = pdfResult.metadata
        documentSource = 'pdf'
        title = source.filename
        break
        
      case 'url':
        const urlResult = await processURL(source.url)
        content = urlResult.content
        metadata = urlResult.metadata
        documentSource = 'url'
        title = metadata.title || source.url
        break
        
      case 'text':
        content = source.content
        metadata = { title: source.title }
        documentSource = 'text'
        title = source.title
        break
    }
    
    // Create document
    const document: Document = {
      id: `doc-${Date.now()}`,
      title,
      content,
      source: documentSource,
      metadata: {
        ...metadata,
        processedAt: new Date(),
        chunkCount: 0
      },
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Chunk the content
    const chunks = chunkText(content, chunkingOptions)
    
    // Associate chunks with document
    chunks.forEach(chunk => {
      chunk.documentId = document.id
      chunk.metadata.documentTitle = title
    })
    
    document.metadata.chunkCount = chunks.length
    document.chunks = chunks
    document.status = 'completed'
    
    const processingTime = Date.now() - startTime
    
    return {
      document,
      chunks,
      success: true,
      processingTime
    }
    
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('Document processing failed:', error)
    
    return {
      document: {} as Document,
      chunks: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime
    }
  }
}
