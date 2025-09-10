/**
 * @fileoverview Provider configuration and management types
 * @description Types for managing multiple AI service providers
 */

export interface ImageProvider {
  id: 'openai' | 'replicate'
  name: string
  description: string
  capabilities: ProviderCapabilities
  pricing: ProviderPricing
  limits: ProviderLimits
  models: ProviderModel[]
  isAvailable: boolean
  status: 'active' | 'inactive' | 'error'
}

export interface ProviderCapabilities {
  imageGeneration: boolean
  imageAnalysis: boolean
  supportedSizes: string[]
  supportedStyles: string[]
  supportedQualities: string[]
  maxPromptLength: number
  batchProcessing: boolean
}

export interface ProviderPricing {
  imageGeneration?: {
    standard: number
    hd: number
    currency: string
    unit: string
  }
  imageAnalysis?: {
    perImage: number
    currency: string
  }
}

export interface ProviderLimits {
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
  maxImageSize: number
  maxBatchSize: number
}

export interface ProviderModel {
  id: string
  name: string
  description: string
  type: 'generation' | 'analysis'
  isDefault: boolean
  parameters?: ModelParameter[]
}

export interface ModelParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  description: string
  defaultValue?: any
  options?: string[]
  min?: number
  max?: number
  required: boolean
}

export interface ProviderConfig {
  provider: 'openai' | 'replicate'
  apiKey: string
  model?: string
  defaultParameters?: Record<string, any>
  isEnabled: boolean
  priority: number
}

export interface ProviderUsageStats {
  provider: 'openai' | 'replicate'
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalCost: number
  averageResponseTime: number
  lastUsed: Date
  requestsToday: number
  costToday: number
}

export interface ProviderFallbackStrategy {
  primaryProvider: 'openai' | 'replicate'
  fallbackProviders: ('openai' | 'replicate')[]
  retryAttempts: number
  retryDelay: number
  failureThreshold: number
}
