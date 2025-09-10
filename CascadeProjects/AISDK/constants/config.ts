/**
 * @fileoverview Application configuration with environment-specific settings
 * @description Centralizes all configuration with type safety and validation
 */

interface AppConfig {
  ai: {
    openai: {
      apiKey: string
      model: string
    }
    anthropic: {
      apiKey: string
      model: string
    }
  }
  rag: {
    pinecone: {
      apiKey: string
      indexName: string
      environment: string
    }
    embeddings: {
      model: string
      dimensions: number
      batchSize: number
    }
    retrieval: {
      topK: number
      threshold: number
      maxChunkSize: number
    }
  }
  images: {
    openai: {
      model: string
      defaultSize: string
      defaultStyle: string
      defaultQuality: string
    }
    replicate: {
      apiToken: string
      model: string
    }
    storage: {
      maxSize: number
      supportedFormats: string[]
    }
    generation: {
      maxRequestsPerHour: number
      defaultProvider: string
    }
    vision: {
      model: string
      maxRequestsPerMinute: number
      detailLevel: string
    }
  }
  app: {
    maxFileSize: number
    maxChatHistory: number
    debugMode: boolean
  }
}

/**
 * Application configuration loaded from environment variables
 * @description Centralizes all configuration with type safety and validation
 */
export const config: AppConfig = {
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    },
  },
  rag: {
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY || '',
      indexName: process.env.PINECONE_INDEX_NAME || 'aisdk-rag',
      environment: process.env.PINECONE_ENVIRONMENT || 'gcp-starter',
    },
    embeddings: {
      model: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
      dimensions: parseInt(process.env.EMBEDDING_DIMENSIONS || '1536'),
      batchSize: parseInt(process.env.EMBEDDING_BATCH_SIZE || '100'),
    },
    retrieval: {
      topK: parseInt(process.env.RAG_TOP_K || '5'),
      threshold: parseFloat(process.env.RAG_THRESHOLD || '0.3'), // Lower for cross-language
      maxChunkSize: parseInt(process.env.RAG_MAX_CHUNK_SIZE || '1000'),
    },
  },
  images: {
    openai: {
      model: process.env.OPENAI_DALLE_MODEL || 'dall-e-3',
      defaultSize: process.env.DEFAULT_IMAGE_SIZE || '1024x1024',
      defaultStyle: process.env.DEFAULT_IMAGE_STYLE || 'vivid',
      defaultQuality: process.env.DEFAULT_IMAGE_QUALITY || 'standard',
    },
    replicate: {
      apiToken: process.env.REPLICATE_API_TOKEN || '',
      model: process.env.STABLE_DIFFUSION_MODEL || 'stability-ai/sdxl',
    },
    storage: {
      maxSize: parseInt(process.env.MAX_IMAGE_SIZE || '10485760'), // 10MB
      supportedFormats: (process.env.SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp,gif').split(','),
    },
    generation: {
      maxRequestsPerHour: parseInt(process.env.MAX_GENERATION_REQUESTS_PER_HOUR || '20'),
      defaultProvider: process.env.DEFAULT_IMAGE_PROVIDER || 'openai',
    },
    vision: {
      model: process.env.GPT4_VISION_MODEL || 'gpt-4o',
      maxRequestsPerMinute: parseInt(process.env.MAX_VISION_REQUESTS_PER_MINUTE || '10'),
      detailLevel: process.env.VISION_DETAIL_LEVEL || 'high',
    },
  },
  app: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    maxChatHistory: parseInt(process.env.MAX_CHAT_HISTORY || '100'),
    debugMode: process.env.NODE_ENV === 'development' || process.env.DEBUG_MODE === 'true',
  },
}

/**
 * Validates required environment variables
 * @description Throws error if critical configuration is missing
 */
export function validateConfig() {
  const missingVars: string[] = []

  if (!config.ai.openai.apiKey) {
    missingVars.push('OPENAI_API_KEY')
  }

  if (!config.rag.pinecone.apiKey) {
    missingVars.push('PINECONE_API_KEY')
  }

  // Image generation is optional, so we just warn
  if (!config.images.replicate.apiToken) {
    console.warn('Warning: REPLICATE_API_TOKEN is not set - Replicate image generation will be disabled')
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

/**
 * Get current AI provider configuration
 * @param provider - The AI provider to get config for
 * @returns Provider-specific configuration
 */
export function getProviderConfig(provider: 'openai' | 'anthropic') {
  return config.ai[provider]
}
