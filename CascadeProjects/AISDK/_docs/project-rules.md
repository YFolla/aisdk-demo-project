# Project Rules

Comprehensive guidelines for building an AI-first, modular, and scalable codebase that maximizes compatibility with modern AI development tools and semantic search.

---

## Core Principles

### **AI-First Development**
- **Modular Architecture**: Each component serves a single, well-defined purpose
- **Semantic Organization**: File and folder names clearly indicate their function
- **Self-Documenting Code**: Code structure and naming make intent obvious
- **Searchable Codebase**: Easy to navigate with both semantic and regex searches
- **Scalable Patterns**: Architecture supports adding new AI features without refactoring

### **File Size Limits**
- **Maximum 500 lines per file** - Split larger files into focused modules
- **Prefer composition over inheritance** - Build complex features from simple parts
- **Single responsibility** - Each file should have one clear purpose
- **Logical grouping** - Related functionality stays together but remains modular

---

## Directory Structure

### **Root Level Organization**
```
/
├── app/                          # Next.js App Router pages and layouts
│   ├── (chat)/                   # Chat-focused route group
│   ├── api/                      # API routes for AI operations
│   ├── globals.css               # Global styles and CSS variables
│   ├── layout.tsx                # Root layout with theme provider
│   └── page.tsx                  # Main chat interface
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (Shadcn)
│   ├── chat/                     # Chat-specific components
│   ├── tools/                    # Tool result display components
│   ├── agents/                   # Agent visualization components
│   └── developer/                # Developer view components
├── lib/                          # Core business logic and utilities
│   ├── ai/                       # AI SDK integrations and providers
│   ├── storage/                  # Local storage and persistence
│   ├── tools/                    # Tool definitions and implementations
│   ├── agents/                   # Agent orchestration logic
│   ├── embeddings/               # Vector search and RAG functionality
│   └── utils/                    # General utilities and helpers
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand state management
├── types/                        # TypeScript type definitions
├── constants/                    # Application constants and configuration
└── _docs/                        # Project documentation
```

### **Detailed Directory Purposes**

#### `/app` - Next.js App Router
```
app/
├── (chat)/                       # Route group for chat interface
│   ├── layout.tsx               # Chat-specific layout
│   └── page.tsx                 # Main chat page
├── api/                         # Server-side API routes
│   ├── chat/                    # Chat completion endpoints
│   │   └── route.ts             # POST /api/chat - main chat handler
│   ├── tools/                   # Tool execution endpoints
│   │   ├── weather/             # Weather tool API
│   │   └── currency/            # Currency conversion API
│   ├── embeddings/              # Document processing endpoints
│   │   ├── upload/              # File upload handler
│   │   └── search/              # Vector search endpoint
│   └── agents/                  # Agent orchestration endpoints
├── globals.css                  # Global styles, CSS variables, Tailwind
├── layout.tsx                   # Root layout with providers
└── page.tsx                     # Redirects to chat interface
```

#### `/components` - UI Components
```
components/
├── ui/                          # Base Shadcn components
│   ├── button.tsx              # Button component variants
│   ├── card.tsx                # Card layouts for results
│   ├── input.tsx               # Form inputs and chat input
│   └── ...                     # Other base UI components
├── chat/                        # Chat interface components
│   ├── chat-interface.tsx      # Main chat container
│   ├── message-list.tsx        # Scrollable message history
│   ├── message-bubble.tsx      # Individual message display
│   ├── chat-input.tsx          # Message input with attachments
│   ├── streaming-indicator.tsx # Typing/processing animations
│   └── provider-selector.tsx   # AI provider switching
├── tools/                       # Tool result components
│   ├── tool-result-card.tsx    # Generic tool result display
│   ├── weather-result.tsx      # Weather-specific formatting
│   ├── currency-result.tsx     # Currency conversion display
│   └── citation-card.tsx       # Document citation display
├── agents/                      # Agent visualization
│   ├── agent-tree.tsx          # Agent delegation hierarchy
│   ├── agent-status.tsx        # Individual agent progress
│   └── mode-selector.tsx       # Tools/Agents/Auto toggle
├── developer/                   # Developer view components
│   ├── developer-panel.tsx     # Collapsible debug information
│   ├── request-trace.tsx       # API request/response details
│   ├── token-usage.tsx         # Token consumption metrics
│   └── performance-metrics.tsx # Latency and cost tracking
└── layout/                      # Layout components
    ├── header.tsx              # Application header
    ├── sidebar.tsx             # Chat history sidebar
    └── right-panel.tsx         # Tool results panel
```

#### `/lib` - Core Logic
```
lib/
├── ai/                          # AI SDK integrations
│   ├── providers/              # Provider-specific configurations
│   │   ├── openai.ts           # OpenAI provider setup
│   │   ├── anthropic.ts        # Claude provider setup
│   │   └── index.ts            # Provider registry and switching
│   ├── streaming.ts            # Streaming response handlers
│   ├── structured-output.ts    # Structured data generation
│   └── error-handling.ts       # AI-specific error handling
├── storage/                     # Data persistence
│   ├── chat-storage.ts         # Chat history persistence
│   ├── document-storage.ts     # Uploaded document management
│   ├── preferences.ts          # User preferences storage
│   └── migrations.ts           # Storage schema migrations
├── tools/                       # Tool implementations
│   ├── registry.ts             # Tool registration and discovery
│   ├── weather.ts              # Weather API integration
│   ├── currency.ts             # Currency conversion logic
│   ├── web-search.ts           # Web search functionality
│   └── types.ts                # Tool parameter schemas
├── agents/                      # Agent orchestration
│   ├── orchestrator.ts         # Main agent coordination
│   ├── planner.ts              # Task planning agent
│   ├── rager.ts                # RAG retrieval agent
│   ├── vision-tagger.ts        # Image analysis agent
│   ├── synthesizer.ts          # Result synthesis agent
│   └── routing.ts              # Auto-routing logic
├── embeddings/                  # Vector search and RAG
│   ├── pinecone-client.ts      # Pinecone vector database
│   ├── document-processor.ts   # PDF/URL content extraction
│   ├── chunking.ts             # Text chunking strategies
│   ├── search.ts               # Vector similarity search
│   └── citation-generator.ts   # Citation formatting
└── utils/                       # General utilities
    ├── validation.ts           # Input validation helpers
    ├── formatting.ts           # Text and data formatting
    ├── debounce.ts             # Performance utilities
    └── constants.ts            # Shared constants
```

#### `/hooks` - Custom React Hooks
```
hooks/
├── use-chat-history.ts          # Chat history management
├── use-streaming-response.ts    # Streaming AI responses
├── use-tool-execution.ts        # Tool execution state
├── use-agent-orchestration.ts   # Agent coordination
├── use-document-upload.ts       # File upload and processing
├── use-vector-search.ts         # RAG search functionality
├── use-developer-view.ts        # Debug information state
└── use-local-storage.ts         # LocalStorage persistence
```

#### `/stores` - State Management
```
stores/
├── chat-store.ts               # Chat messages and history
├── ui-store.ts                 # UI state (panels, modes, themes)
├── tool-store.ts               # Tool execution results
├── agent-store.ts              # Agent orchestration state
├── document-store.ts           # Uploaded documents and embeddings
└── developer-store.ts          # Debug and performance data
```

#### `/types` - TypeScript Definitions
```
types/
├── chat.ts                     # Chat message and conversation types
├── tools.ts                    # Tool parameter and result schemas
├── agents.ts                   # Agent interfaces and state types
├── embeddings.ts               # Vector and document types
├── api.ts                      # API request/response types
└── ui.ts                       # UI component prop types
```

---

## File Naming Conventions

### **Component Files**
- **React Components**: `kebab-case.tsx` (e.g., `chat-interface.tsx`)
- **UI Components**: Match Shadcn naming (e.g., `button.tsx`, `card.tsx`)
- **Page Components**: `page.tsx` for routes, descriptive names for others
- **Layout Components**: `layout.tsx` for Next.js layouts

### **Logic Files**
- **Utilities**: `kebab-case.ts` describing function (e.g., `document-processor.ts`)
- **Stores**: `entity-store.ts` pattern (e.g., `chat-store.ts`)
- **Hooks**: `use-descriptive-name.ts` pattern (e.g., `use-chat-history.ts`)
- **Types**: `entity.ts` pattern (e.g., `chat.ts`, `tools.ts`)

### **API Routes**
- **REST Endpoints**: Follow Next.js App Router conventions
- **Nested Routes**: Use folders for logical grouping (e.g., `/api/tools/weather/`)
- **Route Handlers**: Always named `route.ts`

### **Configuration Files**
- **Environment**: `.env.local` for local development
- **TypeScript**: `tsconfig.json` with strict settings
- **Tailwind**: `tailwind.config.js` with theme extensions
- **ESLint**: `.eslintrc.js` with AI-friendly rules

---

## Code Organization Rules

### **File Structure Template**
Every file should follow this structure:

```typescript
/**
 * @fileoverview Brief description of file purpose and main functionality
 * @author Your Name
 * @created YYYY-MM-DD
 */

// External imports (libraries, frameworks)
import React from 'react'
import { NextRequest, NextResponse } from 'next/server'

// Internal imports (grouped by type)
import { ChatMessage } from '@/types/chat'
import { useChatStore } from '@/stores/chat-store'
import { Button } from '@/components/ui/button'

// Type definitions (if not in separate file)
interface ComponentProps {
  // ... prop definitions
}

// Constants (if not in separate file)
const DEFAULT_CONFIG = {
  // ... configuration
}

// Main implementation
export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // ... implementation
}

// Helper functions (if needed)
function helperFunction(param: string): string {
  // ... helper implementation
}
```

### **Function Documentation**
All functions must have JSDoc comments:

```typescript
/**
 * Processes uploaded documents and generates embeddings for vector search
 * @description Handles PDF and URL content extraction, chunks text semantically,
 * generates embeddings using OpenAI, and stores vectors in Pinecone
 * @param file - The uploaded file (PDF) or URL string to process
 * @param options - Processing options including chunk size and overlap
 * @returns Promise resolving to document metadata and embedding results
 * @throws {ProcessingError} When document format is unsupported
 * @throws {EmbeddingError} When embedding generation fails
 * @example
 * ```typescript
 * const result = await processDocument(file, {
 *   chunkSize: 1000,
 *   overlap: 200
 * })
 * console.log(`Processed ${result.chunks.length} chunks`)
 * ```
 */
async function processDocument(
  file: File | string,
  options: ProcessingOptions
): Promise<DocumentProcessingResult> {
  // Implementation...
}
```

### **Component Documentation**
React components need comprehensive documentation:

```typescript
/**
 * @fileoverview Chat interface component that handles streaming AI conversations
 * with tool calling, agent orchestration, and real-time updates
 */

interface ChatInterfaceProps {
  /** Initial messages to display in chat history */
  initialMessages?: ChatMessage[]
  /** Current AI provider configuration */
  provider?: AIProvider
  /** Whether to show developer debug information */
  showDeveloperView?: boolean
  /** Callback fired when new message is sent */
  onMessageSent?: (message: ChatMessage) => void
}

/**
 * Main chat interface component with streaming responses and tool integration
 * @description Provides a complete chat experience with AI streaming, tool calling,
 * agent orchestration, and developer debugging capabilities. Handles message
 * persistence, provider switching, and real-time updates.
 * @param props - Component configuration and event handlers
 * @returns JSX element containing the full chat interface
 */
export default function ChatInterface({
  initialMessages = [],
  provider,
  showDeveloperView = false,
  onMessageSent
}: ChatInterfaceProps) {
  // Implementation...
}
```

---

## Import Organization

### **Import Order**
1. **External libraries** (React, Next.js, third-party packages)
2. **Internal types** (from `/types`)
3. **Internal utilities** (from `/lib`)
4. **Internal components** (from `/components`)
5. **Internal hooks** (from `/hooks`)
6. **Internal stores** (from `/stores`)
7. **Relative imports** (same directory or parent)

### **Import Grouping Example**
```typescript
// External imports
import React, { useState, useEffect } from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Internal types
import { ChatMessage, ToolCall } from '@/types/chat'
import { AIProvider } from '@/types/ai'

// Internal utilities
import { processDocument } from '@/lib/embeddings/document-processor'
import { searchVectors } from '@/lib/embeddings/search'

// Internal components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageBubble } from '@/components/chat/message-bubble'

// Internal hooks
import { useChatHistory } from '@/hooks/use-chat-history'
import { useStreamingResponse } from '@/hooks/use-streaming-response'

// Internal stores
import { useChatStore } from '@/stores/chat-store'
import { useUIStore } from '@/stores/ui-store'

// Relative imports
import './chat-interface.css'
```

---

## TypeScript Guidelines

### **Strict Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true
  }
}
```

### **Type Definition Patterns**
```typescript
// Use interfaces for object shapes
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: MessageMetadata
}

// Use types for unions and computed types
type AIMode = 'tools' | 'agents' | 'auto'
type MessageRole = ChatMessage['role']

// Use enums for constants with semantic meaning
enum ProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Use const assertions for immutable data
const AI_PROVIDERS = ['openai', 'anthropic', 'fireworks'] as const
type AIProvider = typeof AI_PROVIDERS[number]
```

### **Generic Type Usage**
```typescript
// Generic hook for API calls
function useAPICall<T, P = unknown>(
  endpoint: string,
  params?: P
): {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
} {
  // Implementation...
}

// Generic tool result type
interface ToolResult<T = unknown> {
  toolName: string
  executionTime: number
  result: T
  error?: string
}
```

---

## Error Handling Patterns

### **Error Boundary Implementation**
```typescript
/**
 * @fileoverview Error boundary for AI operations with graceful fallbacks
 */

interface AIErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary specifically designed for AI operations
 * @description Catches errors in AI streaming, tool calls, and agent operations
 * Provides user-friendly error messages and retry functionality
 */
class AIErrorBoundary extends Component<
  PropsWithChildren<{}>,
  AIErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): AIErrorBoundaryState {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    
    // Log specific AI errors
    if (error.message.includes('rate_limit')) {
      console.error('AI Rate Limit Error:', error)
    } else if (error.message.includes('context_length')) {
      console.error('AI Context Length Error:', error)
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }

  private retry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }
}
```

### **API Error Handling**
```typescript
/**
 * Standardized API error response handler
 * @description Processes API errors and returns consistent error objects
 * @param error - The caught error from API call
 * @returns Formatted error object with user-friendly message
 */
function handleAPIError(error: unknown): APIError {
  if (error instanceof Response) {
    return {
      message: `API Error: ${error.status} ${error.statusText}`,
      code: error.status,
      type: 'api_error'
    }
  }

  if (error instanceof Error) {
    // Handle specific AI SDK errors
    if (error.message.includes('rate_limit_exceeded')) {
      return {
        message: 'AI service is temporarily busy. Please try again.',
        code: 429,
        type: 'rate_limit'
      }
    }

    if (error.message.includes('context_length_exceeded')) {
      return {
        message: 'Message too long. Please shorten your request.',
        code: 400,
        type: 'context_length'
      }
    }

    return {
      message: error.message,
      code: 500,
      type: 'unknown_error'
    }
  }

  return {
    message: 'An unexpected error occurred',
    code: 500,
    type: 'unknown_error'
  }
}
```

---

## Testing Patterns

### **Test File Organization**
```
components/
├── chat/
│   ├── chat-interface.tsx
│   ├── chat-interface.test.tsx    # Unit tests
│   ├── message-bubble.tsx
│   └── message-bubble.test.tsx
lib/
├── ai/
│   ├── streaming.ts
│   ├── streaming.test.ts          # Unit tests
│   ├── streaming.integration.test.ts  # Integration tests
```

### **Test Documentation**
```typescript
/**
 * @fileoverview Unit tests for chat interface component
 * Tests streaming functionality, tool integration, and user interactions
 */

describe('ChatInterface', () => {
  /**
   * Test streaming message display functionality
   * @description Verifies that streaming messages appear progressively
   * and typing indicators work correctly
   */
  it('should display streaming messages progressively', async () => {
    // Test implementation...
  })

  /**
   * Test tool call integration
   * @description Ensures tool calls are triggered correctly and results
   * are displayed in the appropriate format
   */
  it('should handle tool calls and display results', async () => {
    // Test implementation...
  })
})
```

---

## Performance Guidelines

### **Code Splitting**
```typescript
// Lazy load heavy components
const PDFViewer = lazy(() => import('@/components/documents/pdf-viewer'))
const AgentTree = lazy(() => import('@/components/agents/agent-tree'))
const DeveloperPanel = lazy(() => import('@/components/developer/developer-panel'))

// Use dynamic imports for optional features
const loadImageGeneration = () => import('@/lib/tools/image-generation')
const loadVectorSearch = () => import('@/lib/embeddings/search')
```

### **Memoization Patterns**
```typescript
/**
 * Memoized message list to prevent unnecessary re-renders
 * @description Only re-renders when messages array changes,
 * not when other chat state updates
 */
const MessageList = memo(({ messages }: { messages: ChatMessage[] }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
})

// Memoize expensive calculations
const processedMessages = useMemo(() => {
  return messages.map(processMessageForDisplay)
}, [messages])
```

---

## Deployment and Build Guidelines

### **Environment Configuration**
```typescript
// constants/config.ts
/**
 * @fileoverview Application configuration with environment-specific settings
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
  pinecone: {
    apiKey: string
    environment: string
    indexName: string
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
      apiKey: process.env.OPENAI_API_KEY!,
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022'
    }
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
    indexName: process.env.PINECONE_INDEX_NAME || 'ai-lab-vectors'
  },
  app: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    maxChatHistory: parseInt(process.env.MAX_CHAT_HISTORY || '100'),
    debugMode: process.env.NODE_ENV === 'development'
  }
}
```

### **Build Optimization**
```javascript
// next.config.js
/**
 * Next.js configuration optimized for AI applications
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Optimize bundle for AI SDK usage
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'cheerio'],
  },
  
  // Bundle analyzer for monitoring size
  ...(process.env.ANALYZE === 'true' && {
    plugins: [require('@next/bundle-analyzer')({ enabled: true })]
  }),
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  }
}

module.exports = nextConfig
```

These comprehensive project rules ensure that the codebase remains modular, searchable, and maintainable while supporting rapid AI feature development and easy onboarding for new developers or AI tools.
