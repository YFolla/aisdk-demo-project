/**
 * @fileoverview AI SDK tools using the official tool() helper function
 * @description Proper implementation following AI SDK v5 documentation patterns
 */

import { tool } from 'ai'
import { z } from 'zod'
import { generateEmbedding } from '@/lib/embeddings/openai-embeddings'
import { queryVectors } from '@/lib/vector/pinecone-client'
import { config } from '@/constants/config'
import { generateImageTool } from './generate-image'
import { describeImageTool } from './describe-image'

/**
 * Weather tool - Get current weather conditions for a location
 * Following the official AI SDK documentation pattern
 */
export const weatherTool = tool({
  description: 'Get current weather conditions for a specified location including temperature, humidity, wind speed, and general conditions',
  inputSchema: z.object({
    location: z.string().describe('City name, state, country, or coordinates (lat,lon)'),
    units: z.enum(['celsius', 'fahrenheit', 'kelvin']).optional().describe('Temperature units (default: celsius)')
  }),
  execute: async ({ location, units = 'celsius' }) => {
    console.log('Weather tool executed:', { location, units })
    
    // Mock weather data - in production, integrate with real weather API
    const temperature = units === 'fahrenheit' ? 72 : 22
    const windSpeed = units === 'fahrenheit' ? 8.5 : 3.8
    const tempUnit = units === 'fahrenheit' ? '°F' : '°C'
    
    return {
      location,
      temperature,
      description: 'Partly cloudy with light winds',
      humidity: 65,
      windSpeed,
      units: tempUnit,
      feelsLike: temperature + (units === 'fahrenheit' ? 3 : 2),
      visibility: 10,
      pressure: 1013,
      timestamp: new Date().toISOString()
    }
  }
})

/**
 * Currency conversion tool - Convert amounts between currencies
 * Following the official AI SDK documentation pattern
 */
export const currencyTool = tool({
  description: 'Convert an amount from one currency to another using current exchange rates. Supports major world currencies like USD, EUR, GBP, JPY, etc.',
  inputSchema: z.object({
    amount: z.number().positive().describe('Amount to convert (must be positive)'),
    from: z.string().length(3).describe('Source currency code (e.g., USD, EUR, GBP)'),
    to: z.string().length(3).describe('Target currency code (e.g., USD, EUR, GBP)')
  }),
  execute: async ({ amount, from, to }) => {
    console.log('Currency tool executed:', { amount, from, to })
    
    // Mock exchange rates - in production, use real API like exchangerate-api.com
    const mockRates: Record<string, number> = {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      BRL: 5.2
    }
    
    const fromRate = mockRates[from.toUpperCase()] || 1.0
    const toRate = mockRates[to.toUpperCase()] || 1.0
    const exchangeRate = toRate / fromRate
    const convertedAmount = Math.round((amount * exchangeRate) * 100) / 100
    
    return {
      amount,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      convertedAmount,
      exchangeRate: Math.round(exchangeRate * 10000) / 10000,
      lastUpdated: new Date().toISOString(),
      provider: 'mock-rates'
    }
  }
})

/**
 * Document retrieval tool - Search for relevant documents using RAG
 * Following the official AI SDK documentation pattern
 */
export const retrieveDocsTool = tool({
  description: 'Search through uploaded documents to find relevant information based on a query. Use this when the user asks questions that might be answered by their documents.',
  inputSchema: z.object({
    query: z.string().min(1).describe('Search query to find relevant documents'),
    topK: z.number().min(1).max(20).optional().describe('Number of results to return (1-20, default: 5)'),
    threshold: z.number().min(0).max(1).optional().describe('Minimum similarity threshold (0-1, default: 0.3 for cross-language support)')
  }),
  execute: async ({ query, topK = 5, threshold = 0.3 }) => {
    console.log('Document retrieval tool executed:', { query, topK, threshold })
    
    try {
      // Generate embedding for the query
      const queryEmbedding = await generateEmbedding(query)
      
      // Search for similar documents in Pinecone
      // Use lower threshold for cross-language queries (French documents, English queries)
      const searchResults = await queryVectors(queryEmbedding, {
        topK: Math.min(topK, config.rag.retrieval.topK),
        threshold: Math.min(threshold, 0.3), // Lower threshold for cross-language similarity
        includeMetadata: true
      })
      
      if (searchResults.length === 0) {
        return {
          query,
          results: [],
          message: 'No relevant documents found for this query. You may need to upload documents first.',
          totalResults: 0,
          searchTime: 0
        }
      }
      
      // Format results for the AI model
      const formattedResults = searchResults.map((result, index) => ({
        id: result.id,
        content: result.content,
        source: result.metadata.documentTitle || 'Unknown Document',
        page: result.metadata.page,
        relevanceScore: Math.round(result.score * 100) / 100,
        rank: index + 1
      }))
      
      return {
        query,
        results: formattedResults,
        message: `Found ${formattedResults.length} relevant document(s)`,
        totalResults: formattedResults.length,
        searchTime: Date.now() // Simplified timing
      }
      
    } catch (error) {
      console.error('Document retrieval error:', error)
      return {
        query,
        results: [],
        message: `Error searching documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalResults: 0,
        searchTime: 0,
        error: true
      }
    }
  }
})

/**
 * Get all AI SDK tools for use in streamText/generateText
 * Returns the tools object in the format expected by the AI SDK
 */
export function getAISDKTools() {
  return {
    get_weather: weatherTool,
    convert_currency: currencyTool,
    retrieve_docs: retrieveDocsTool,
    generate_image: generateImageTool,
    describe_image: describeImageTool
  }
}
