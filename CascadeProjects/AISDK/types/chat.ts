/**
 * @fileoverview Chat-related type definitions for messages, conversations, and AI interactions
 * @description Defines interfaces for chat messages, tool calls, and conversation state
 */

/**
 * Represents a single chat message in a conversation
 * @description Core message structure supporting user, assistant, and system messages
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string
  /** Message content as text */
  content: string
  /** Role indicating who sent the message */
  role: 'user' | 'assistant' | 'system'
  /** Timestamp when message was created */
  timestamp: Date
  /** Optional metadata for tool calls and AI processing info */
  metadata?: MessageMetadata
}

/**
 * Additional metadata associated with a chat message
 * @description Contains tool call information and AI processing metrics
 */
export interface MessageMetadata {
  /** Tool calls made during message processing */
  tools?: ToolCall[]
  /** Token usage information */
  tokens?: {
    input: number
    output: number
    total: number
  }
  /** Processing time in milliseconds */
  processingTime?: number
  /** AI model used for generation */
  model?: string
  /** Whether message is currently streaming */
  isStreaming?: boolean
}

/**
 * Represents a tool call made by the AI
 * @description Structure for AI tool invocations and their results
 */
export interface ToolCall {
  /** Unique identifier for the tool call */
  id: string
  /** Name of the tool being called */
  name: string
  /** Parameters passed to the tool */
  parameters: Record<string, unknown>
  /** Result returned by the tool */
  result?: unknown
  /** Error message if tool call failed */
  error?: string
  /** Execution time in milliseconds */
  executionTime?: number
}

/**
 * Available AI modes for conversation handling
 * @description Different approaches to processing user requests
 */
export type AIMode = 'tools' | 'agents' | 'auto'

/**
 * Available AI providers for conversation handling
 * @description Supported AI service providers
 */
export type AIProvider = 'openai' | 'anthropic'

/**
 * Chat conversation state and configuration
 * @description Complete conversation context and settings
 */
export interface ChatState {
  /** Array of messages in the conversation */
  messages: ChatMessage[]
  /** Current AI processing mode */
  currentMode: AIMode
  /** Current AI provider */
  currentProvider: AIProvider
  /** Whether AI is currently processing */
  isLoading: boolean
  /** Current error state if any */
  error: string | null
  /** Whether developer view is enabled */
  showDeveloperView: boolean
}

/**
 * Chat store actions for state management
 * @description Available actions to modify chat state
 */
export interface ChatActions {
  /** Add a new message to the conversation */
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  /** Update an existing message */
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  /** Remove a message from the conversation */
  removeMessage: (id: string) => void
  /** Clear all messages */
  clearMessages: () => void
  /** Set the current AI mode */
  setMode: (mode: AIMode) => void
  /** Set the current AI provider */
  setProvider: (provider: AIProvider) => void
  /** Set loading state */
  setLoading: (loading: boolean) => void
  /** Set error state */
  setError: (error: string | null) => void
  /** Toggle developer view */
  toggleDeveloperView: () => void
}
