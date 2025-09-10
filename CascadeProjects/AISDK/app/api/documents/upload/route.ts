/**
 * @fileoverview Document upload API endpoint
 * @description Handles file uploads, processing, and vector storage
 */

import { NextRequest, NextResponse } from 'next/server'
import { processDocument } from '@/lib/documents/processor'
import { generateEmbeddings } from '@/lib/embeddings/openai-embeddings'
import { upsertVectors } from '@/lib/vector/pinecone-client'
import { config, validateConfig } from '@/constants/config'

// Removed edge runtime due to compatibility issues with PDF processing

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig()

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const source = formData.get('source') as string
    const url = formData.get('url') as string
    const textContent = formData.get('content') as string
    const title = formData.get('title') as string

    if (!file && !url && !textContent) {
      return NextResponse.json(
        { error: 'Either file, URL, or text content is required' },
        { status: 400 }
      )
    }

    let processingResult

    if (file) {
      // Handle file upload
      if (file.size > config.app.maxFileSize) {
        return NextResponse.json(
          { error: `File size exceeds maximum limit of ${config.app.maxFileSize} bytes` },
          { status: 400 }
        )
      }

      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Only PDF files are supported' },
          { status: 400 }
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      processingResult = await processDocument({
        type: 'pdf',
        buffer,
        filename: file.name
      })
    } else if (url) {
      // Handle URL processing
      processingResult = await processDocument({
        type: 'url',
        url
      })
    } else {
      // Handle text content
      processingResult = await processDocument({
        type: 'text',
        content: textContent,
        title: title || 'Untitled Document'
      })
    }

    if (!processingResult.success) {
      return NextResponse.json(
        { error: processingResult.error || 'Document processing failed' },
        { status: 500 }
      )
    }

    const { document, chunks } = processingResult

    // Generate embeddings for all chunks
    const chunkTexts = chunks.map(chunk => chunk.content)
    const embeddings = await generateEmbeddings(chunkTexts)

    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, index) => ({
      id: chunk.id,
      values: embeddings[index],
      metadata: {
        documentId: document.id,
        chunkId: chunk.id,
        documentTitle: document.title,
        source: document.source,
        page: chunk.metadata.page,
        section: chunk.metadata.section,
        wordCount: chunk.metadata.wordCount,
        createdAt: document.createdAt.toISOString(),
        content: chunk.content // Store content in metadata for retrieval
      }
    }))

    // Store vectors in Pinecone
    await upsertVectors(vectors)

    // Store document metadata in localStorage (client-side will handle this)
    const documentSummary = {
      id: document.id,
      title: document.title,
      source: document.source,
      chunkCount: chunks.length,
      createdAt: document.createdAt,
      status: 'completed'
    }

    return NextResponse.json({
      success: true,
      document: documentSummary,
      message: `Successfully processed ${chunks.length} chunks from "${document.title}"`,
      processingTime: processingResult.processingTime
    })

  } catch (error) {
    console.error('Document upload error:', error)
    
    // Detailed error logging for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}
