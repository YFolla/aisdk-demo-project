/**
 * @fileoverview Test RAG retrieval functionality
 * @description Debug endpoint to test document retrieval and similarity scores
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/embeddings/openai-embeddings'
import { queryVectors, getIndexStats } from '@/lib/vector/pinecone-client'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log('Testing RAG retrieval for query:', query)

    // Get index stats first
    const stats = await getIndexStats()
    console.log('Index stats:', stats)

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)
    console.log('Query embedding generated, dimensions:', queryEmbedding.length)

    // Search with very low threshold to see all results
    const searchResults = await queryVectors(queryEmbedding, {
      topK: 10,
      threshold: 0.0, // Very low threshold to see all matches
      includeMetadata: true
    })

    console.log('Search results:', searchResults.length, 'matches found')
    
    // Log detailed results
    searchResults.forEach((result, index) => {
      console.log(`Result ${index + 1}:`, {
        id: result.id,
        score: result.score,
        contentPreview: result.content.substring(0, 100) + '...',
        metadata: result.metadata
      })
    })

    return NextResponse.json({
      success: true,
      query,
      indexStats: stats,
      queryEmbeddingDimensions: queryEmbedding.length,
      results: searchResults.map(result => ({
        id: result.id,
        score: result.score,
        contentPreview: result.content.substring(0, 200) + '...',
        metadata: result.metadata
      })),
      totalResults: searchResults.length
    })

  } catch (error) {
    console.error('RAG test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Just get index stats
    const stats = await getIndexStats()
    
    return NextResponse.json({
      success: true,
      indexStats: stats
    })
  } catch (error) {
    console.error('RAG stats error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
