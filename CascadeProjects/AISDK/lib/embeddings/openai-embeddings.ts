/**
 * @fileoverview OpenAI embeddings generation service
 * @description Handles text embedding generation using OpenAI's embedding models
 */

import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { EmbeddingConfig, EmbeddingRequest, EmbeddingResponse } from '@/types/rag'

export const EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'text-embedding-3-small',
  dimensions: 1536,
  maxTokens: 8192
}

/**
 * Generate embeddings for a single text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!text.trim()) {
      throw new Error('Text cannot be empty')
    }

    // Truncate text if it's too long (rough token estimation: 1 token ≈ 4 characters)
    const maxChars = EMBEDDING_CONFIG.maxTokens * 4
    const truncatedText = text.length > maxChars ? text.substring(0, maxChars) : text

    const { embedding } = await embed({
      model: openai.embedding(EMBEDDING_CONFIG.model),
      value: truncatedText
    })

    return embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate embeddings for multiple text strings in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    if (texts.length === 0) {
      return []
    }

    // Process in batches to avoid rate limits
    const batchSize = 100
    const embeddings: number[][] = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      const batchPromises = batch.map(text => generateEmbedding(text))
      const batchEmbeddings = await Promise.all(batchPromises)
      embeddings.push(...batchEmbeddings)
    }

    return embeddings
  } catch (error) {
    console.error('Error generating batch embeddings:', error)
    throw new Error(`Failed to generate batch embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function calculateSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same dimensions')
  }

  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i]
    magnitude1 += embedding1[i] * embedding1[i]
    magnitude2 += embedding2[i] * embedding2[i]
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Validate embedding dimensions
 */
export function validateEmbedding(embedding: number[]): boolean {
  return (
    Array.isArray(embedding) &&
    embedding.length === EMBEDDING_CONFIG.dimensions &&
    embedding.every(value => typeof value === 'number' && !isNaN(value))
  )
}
