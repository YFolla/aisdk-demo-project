/**
 * @fileoverview Pinecone vector database client configuration
 * @description Handles connection and operations with Pinecone vector database
 */

import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeConfig, VectorSearchResult, VectorMetadata } from '@/types/rag'

let pineconeClient: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required')
    }
    
    console.log('Initializing Pinecone client with API key:', apiKey.substring(0, 10) + '...')
    
    pineconeClient = new Pinecone({
      apiKey: apiKey
    })
  }
  
  return pineconeClient
}

export const PINECONE_CONFIG: PineconeConfig = {
  indexName: 'aisdk-rag',
  environment: process.env.PINECONE_ENVIRONMENT || 'gcp-starter',
  dimensions: 1536, // text-embedding-3-small
  metric: 'cosine',
  namespace: 'aisdk-documents'
}

export async function verifyIndexExists(): Promise<boolean> {
  try {
    const client = getPineconeClient()
    const indexList = await client.listIndexes()
    const exists = indexList.indexes?.some(index => index.name === PINECONE_CONFIG.indexName)
    console.log('Index verification result:', { indexName: PINECONE_CONFIG.indexName, exists })
    return exists || false
  } catch (error) {
    console.error('Error verifying index exists:', error)
    return false
  }
}

export async function upsertVectors(
  vectors: Array<{
    id: string
    values: number[]
    metadata: VectorMetadata
  }>
): Promise<void> {
  try {
    console.log('Attempting to upsert vectors to Pinecone:', {
      vectorCount: vectors.length,
      indexName: PINECONE_CONFIG.indexName,
      namespace: PINECONE_CONFIG.namespace
    })
    
    // Skip index verification since we know it exists, try direct connection
    const client = getPineconeClient()
    const index = client.index(PINECONE_CONFIG.indexName)
    
    console.log('Pinecone client and index created successfully')
    
    // Try direct upsert since the index exists
    await index.namespace(PINECONE_CONFIG.namespace!).upsert(vectors)
    
    console.log('Successfully upserted vectors to Pinecone')
  } catch (error) {
    console.error('Error upserting vectors to Pinecone:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    throw new Error(`Failed to store document vectors: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function queryVectors(
  queryVector: number[],
  options: {
    topK?: number
    threshold?: number
    filter?: Record<string, any>
    includeMetadata?: boolean
  } = {}
): Promise<VectorSearchResult[]> {
  try {
    const client = getPineconeClient()
    const index = client.index(PINECONE_CONFIG.indexName)
    
    console.log('Querying vectors with options:', {
      topK: options.topK || 5,
      threshold: options.threshold || 0.3,
      namespace: PINECONE_CONFIG.namespace
    })
    
    const queryResponse = await index.namespace(PINECONE_CONFIG.namespace!).query({
      vector: queryVector,
      topK: options.topK || 5,
      includeMetadata: options.includeMetadata !== false,
      includeValues: false,
      filter: options.filter
    })
    
    console.log(`Raw Pinecone matches: ${queryResponse.matches.length}`)
    queryResponse.matches.forEach((match, idx) => {
      console.log(`Match ${idx + 1}: score=${match.score}, id=${match.id}`)
    })
    
    const threshold = options.threshold || 0.3 // Default to 0.3 for cross-language
    const filteredResults = queryResponse.matches
      .filter(match => match.score && match.score >= threshold)
      .map(match => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata as VectorMetadata,
        content: (match.metadata as any)?.content || ''
      }))
      
    console.log(`Filtered results (threshold >= ${threshold}): ${filteredResults.length}`)
    
    return filteredResults
  } catch (error) {
    console.error('Error querying vectors from Pinecone:', error)
    throw new Error('Failed to retrieve relevant documents')
  }
}

export async function deleteVectors(ids: string[]): Promise<void> {
  try {
    const client = getPineconeClient()
    const index = client.index(PINECONE_CONFIG.indexName)
    
    await index.namespace(PINECONE_CONFIG.namespace!).deleteMany(ids)
  } catch (error) {
    console.error('Error deleting vectors from Pinecone:', error)
    throw new Error('Failed to delete document vectors')
  }
}

export async function getIndexStats(): Promise<{
  totalVectors: number
  dimension: number
  indexFullness: number
}> {
  try {
    const client = getPineconeClient()
    const index = client.index(PINECONE_CONFIG.indexName)
    
    const stats = await index.describeIndexStats()
    
    return {
      totalVectors: stats.totalRecordCount || 0,
      dimension: stats.dimension || PINECONE_CONFIG.dimensions,
      indexFullness: stats.indexFullness || 0
    }
  } catch (error) {
    console.error('Error getting index stats from Pinecone:', error)
    throw new Error('Failed to retrieve index statistics')
  }
}
