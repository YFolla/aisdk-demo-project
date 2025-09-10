/**
 * @fileoverview Chat API route for streaming AI responses
 * @description Handles chat requests with OpenAI integration and streaming responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@ai-sdk/openai'
import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { config, validateConfig } from '@/constants/config'
import { getAISDKTools } from '@/lib/tools/ai-sdk-tools'

/**
 * Preprocess messages to handle large image content and avoid context length issues
 */
function preprocessMessages(messages: any[]) {
  return messages.map(message => {
    // Handle assistant messages with parts (tool outputs)
    if (message.role === 'assistant' && message.parts) {
      const processedParts = message.parts.map((part: any) => {
        // Handle image generation tool outputs
        if (part.type === 'tool-generate_image') {
          return {
            type: part.type,
            output: {
              success: part.output?.success || false,
              contextSummary: `Generated image: ${part.output?.prompt?.substring(0, 30) || 'unknown'}...`,
              provider: part.output?.provider || 'openai',
              imageId: part.output?.imageId,
              // Remove all large data
              imageUrl: '[Image generated - view in chat]',
              prompt: part.output?.prompt?.substring(0, 50) + '...',
              revisedPrompt: part.output?.revisedPrompt?.substring(0, 50) + '...'
            }
          }
        }
        
        // Handle other tool outputs - keep them minimal
        if (part.type?.startsWith('tool-')) {
          return {
            type: part.type,
            output: part.output ? {
              success: part.output.success,
              summary: typeof part.output === 'string' 
                ? part.output.substring(0, 200) + '...'
                : JSON.stringify(part.output).substring(0, 200) + '...'
            } : undefined
          }
        }
        
        // Handle text parts
        if (part.type === 'text') {
          return {
            type: 'text',
            text: part.text?.length > 1000 ? part.text.substring(0, 1000) + '...' : part.text
          }
        }
        
        return part
      })
      
      return {
        ...message,
        parts: processedParts,
        // Also truncate main content if it exists
        content: message.content?.length > 500 ? message.content.substring(0, 500) + '...' : message.content
      }
    }
    
    // Handle user messages - keep them as is but truncate if too long
    if (message.role === 'user') {
      return {
        ...message,
        content: message.content?.length > 2000 ? message.content.substring(0, 2000) + '...' : message.content
      }
    }
    
    return message
  })
}

// Removed edge runtime due to Pinecone compatibility issues with RAG tools

/**
 * Handle POST requests for chat completion
 * @description Processes chat messages and returns streaming AI responses
 * @param request - Next.js request object containing chat messages
 * @returns Streaming response from AI model
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called')
    
    // Parse request body
    const { messages } = await request.json()
    console.log('Received messages:', messages?.length)

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Preprocess messages to handle large image content
    const processedMessages = preprocessMessages(messages)
    console.log('Processed messages for context optimization')
    
    // Debug: Check message sizes and apply final safety limits
    const finalMessages = processedMessages.map((msg, idx) => {
      const msgSize = JSON.stringify(msg).length
      console.log(`Message ${idx} (${msg.role}): ${msgSize} characters`)
      
      // If still too large, apply emergency truncation
      if (msgSize > 5000) {
        console.warn(`⚠️ Emergency truncation for message ${idx}: ${msgSize} chars`)
        return {
          role: msg.role,
          content: `[Message truncated for context limits] ${JSON.stringify(msg).substring(0, 1000)}...`
        }
      }
      
      return msg
    })
    
    // Final check: limit total conversation size
    const totalSize = JSON.stringify(finalMessages).length
    console.log(`Total conversation size: ${totalSize} characters`)
    
    let messagesToUse = finalMessages
    if (totalSize > 50000) {
      console.warn('⚠️ Conversation too large, keeping only recent messages')
      // Keep only the last few messages if conversation is too large
      messagesToUse = finalMessages.slice(-3)
      console.log(`Reduced to ${messagesToUse.length} recent messages`)
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY
    console.log('API key exists:', !!apiKey)
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create streaming response with AI SDK tools (following official documentation)
    console.log('Creating streaming response with AI SDK tools...')
    const tools = getAISDKTools()
    console.log('Tools loaded:', Object.keys(tools))
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: convertToModelMessages(messagesToUse),
      tools,
      stopWhen: stepCountIs(5), // Allow up to 5 steps for multi-step tool calls
      temperature: 0.7,
      maxCompletionTokens: 1000,
    })

    console.log('Streaming response created successfully')
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while processing your request.',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * Handle GET requests (not supported)
 * @description Returns method not allowed for GET requests
 * @returns Error response indicating POST is required
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send chat messages.' },
    { status: 405 }
  )
}
