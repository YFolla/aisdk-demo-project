/**
 * @fileoverview Tool-related type definitions for AI SDK tool calling
 * @description Defines interfaces for tool results and execution contexts
 */

/**
 * Weather tool result data structure
 * @description Structured weather information returned by weather tool
 */
export interface WeatherData {
  location: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  units?: string
  feelsLike?: number
  visibility?: number
  pressure?: number
  timestamp?: string
}

/**
 * Currency conversion result data structure
 * @description Structured currency conversion information returned by currency tool
 */
export interface CurrencyData {
  amount: number
  from: string
  to: string
  convertedAmount: number
  exchangeRate: number
  lastUpdated?: string
  provider?: string
}

/**
 * Tool call information from AI SDK
 * @description Information about a tool call made by the AI
 */
export interface AIToolCall {
  /** Unique identifier for this tool call */
  id: string
  /** Name of the tool being called */
  name: string
  /** Parameters passed to the tool */
  parameters: Record<string, any>
}

/**
 * Enhanced tool call with execution result
 * @description Tool call information with execution results for UI display
 */
export interface ExecutedToolCall extends AIToolCall {
  /** Result of the tool execution */
  result: WeatherData | CurrencyData | any
  /** When the tool was executed */
  executedAt: Date
  /** Whether the execution was successful */
  success: boolean
  /** Error message if execution failed */
  error?: string
}

/**
 * Tool execution context for UI components
 * @description Context information for displaying tool results
 */
export interface ToolExecutionContext {
  /** User message that triggered the tool call */
  userMessage?: string
  /** Tool execution details */
  toolCall?: ExecutedToolCall
  /** Execution time in milliseconds */
  executionTime?: number
}