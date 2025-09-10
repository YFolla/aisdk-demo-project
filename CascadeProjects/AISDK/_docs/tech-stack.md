# Tech Stack Guide

Comprehensive guide covering best practices, limitations, and conventions for the AI Lab project stack.

---

## Next.js + App Router

### Best Practices
- **Server Components by Default**: Use client components (`'use client'`) only when necessary (state, effects, browser APIs)
- **Streaming Patterns**: Leverage `loading.tsx` and `Suspense` for progressive loading of AI responses
- **Route Organization**: Group related routes in folders with `page.tsx`, `layout.tsx`, and `loading.tsx`
- **API Routes**: Place AI endpoints in `app/api/` with proper error handling and streaming responses
- **Metadata Management**: Use `generateMetadata()` for dynamic SEO optimization

### Limitations & Pitfalls
- **Hydration Mismatches**: Be careful with client-side state that differs from server-rendered content
- **Bundle Size**: App Router can increase bundle size; use dynamic imports for heavy components
- **Caching Complexity**: Understanding Next.js caching layers (router cache, full route cache, data cache)
- **Server Component Restrictions**: Cannot use hooks, event handlers, or browser APIs directly

### Conventions
- Use `app/` directory structure exclusively
- Name client components with `.client.tsx` suffix for clarity
- Keep server actions in separate files with `'use server'` directive
- Use TypeScript interfaces for all props and API responses

---

## Vercel AI SDK

### Best Practices
- **useChat Hook**: Primary interface for streaming chat functionality
- **Tool Definitions**: Use Zod schemas for robust tool parameter validation
- **Structured Output**: Leverage `generateObject()` for consistent data formats
- **Provider Abstraction**: Use the SDK's provider interface to enable easy model switching
- **Error Handling**: Implement proper error boundaries for AI failures

### Limitations & Pitfalls
- **Token Limits**: Always handle context window limitations with proper truncation
- **Rate Limiting**: Implement client-side debouncing and server-side rate limiting
- **Streaming Interruption**: Handle network issues that break streaming connections
- **Tool Call Errors**: Tools can fail; implement fallback strategies
- **Cost Management**: Monitor token usage, especially with vision models and long conversations

### Conventions
- Wrap all AI interactions in try-catch blocks
- Use TypeScript for all tool schemas and response types
- Implement loading states for all AI operations
- Store conversation history in structured format for persistence

```typescript
// Example tool definition
const weatherTool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: z.object({
    location: z.string().describe('City name'),
    units: z.enum(['celsius', 'fahrenheit']).optional()
  })
}
```

---

## Claude Code (Agents)

### Best Practices
- **Agent Specialization**: Create focused agents for specific tasks (RAG, Vision, Planning)
- **State Management**: Use structured state objects to track agent progress
- **Orchestration Patterns**: Implement clear delegation and result aggregation
- **Retry Logic**: Build resilience with exponential backoff for failed operations
- **Observability**: Log all agent interactions for debugging and optimization

### Limitations & Pitfalls
- **Complexity Overhead**: Agents add latency; use only when simple tools aren't sufficient
- **Cost Multiplication**: Multiple agent calls can quickly increase costs
- **Error Propagation**: Agent failures can cascade through the system
- **Context Loss**: Long agent chains may lose important context
- **Debugging Difficulty**: Complex agent interactions are harder to troubleshoot

### Conventions
- Define clear agent interfaces with input/output types
- Implement timeout mechanisms for all agent operations
- Use structured logging for agent decision tracking
- Provide fallback to simple tools when agents fail

---

## TypeScript

### Best Practices
- **Strict Mode**: Enable all strict TypeScript compiler options
- **Interface Definitions**: Create explicit interfaces for all data structures
- **Generic Types**: Use generics for reusable components and functions
- **Utility Types**: Leverage built-in utility types (`Pick`, `Omit`, `Partial`)
- **Type Guards**: Implement runtime type checking for external data

### Limitations & Pitfalls
- **Build Time**: TypeScript compilation can slow development builds
- **Learning Curve**: Complex types can be difficult for team members to understand
- **Any Escape Hatch**: Avoid `any` type; use `unknown` for truly unknown data
- **Over-engineering**: Don't create overly complex type hierarchies
- **Third-party Types**: Some libraries have poor or missing type definitions

### Conventions
- Use PascalCase for interfaces and types
- Prefix interfaces with `I` only when necessary for disambiguation
- Export types alongside implementation code
- Use const assertions for immutable data structures

```typescript
// Example interface
interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp: Date
  metadata?: {
    tools?: ToolCall[]
    tokens?: number
  }
}
```

---

## Pinecone Vector Database

### Best Practices
- **Index Configuration**: Choose appropriate dimensions and metric (cosine for embeddings)
- **Metadata Filtering**: Use metadata for efficient filtering without full vector search
- **Batch Operations**: Upsert vectors in batches for better performance
- **Namespace Organization**: Use namespaces to separate different document types
- **Connection Pooling**: Reuse Pinecone client instances across requests

### Limitations & Pitfalls
- **Cold Start Latency**: First queries after idle periods can be slower
- **Cost Scaling**: Costs increase with index size and query volume
- **Metadata Limits**: Metadata size is limited; don't store large content
- **Consistency**: Eventual consistency means recent upserts might not appear immediately
- **Index Management**: Deleting and recreating indexes takes time

### Conventions
- Use consistent metadata schema across all vectors
- Include timestamp and source information in metadata
- Implement retry logic for network failures
- Monitor index statistics and performance metrics

```typescript
// Example vector upsert
await index.upsert([{
  id: `doc-${documentId}-chunk-${chunkIndex}`,
  values: embedding,
  metadata: {
    source: 'pdf',
    title: document.title,
    chunk_index: chunkIndex,
    timestamp: Date.now()
  }
}])
```

---

## OpenAI Embeddings

### Best Practices
- **Text Preprocessing**: Clean and normalize text before embedding
- **Chunk Strategy**: Use semantic chunking (paragraphs, sections) over fixed-size chunks
- **Batch Processing**: Process multiple texts in single API calls when possible
- **Caching**: Cache embeddings to avoid recomputing for identical content
- **Dimension Awareness**: Use text-embedding-3-small (1536 dimensions) consistently

### Limitations & Pitfalls
- **Rate Limits**: OpenAI has strict rate limits; implement proper queuing
- **Context Length**: Maximum 8191 tokens per embedding request
- **Cost Accumulation**: Embedding large document sets can be expensive
- **Version Consistency**: Different embedding models aren't compatible
- **Language Bias**: Performance varies across different languages

### Conventions
- Store embedding model version with vectors
- Use consistent text preprocessing pipeline
- Implement exponential backoff for rate limit handling
- Track embedding costs and usage metrics

---

## LocalStorage + JSON

### Best Practices
- **Data Structure**: Use consistent JSON schema for stored data
- **Size Management**: Monitor storage usage; LocalStorage has ~5-10MB limit
- **Serialization**: Handle Date objects and complex types properly
- **Error Handling**: Wrap localStorage operations in try-catch blocks
- **Performance**: Avoid frequent large object serialization/deserialization

### Limitations & Pitfalls
- **Storage Limits**: Browser-dependent size limits (typically 5-10MB)
- **Synchronous API**: Can block main thread with large data operations
- **No Encryption**: Data is stored in plain text
- **Browser Clearing**: Users can clear storage, losing all data
- **No Sharing**: Data isn't shared between browser tabs/sessions

### Conventions
- Use prefixed keys to avoid conflicts (`aisdk_chat_history`)
- Implement data versioning for schema migrations
- Provide export/import functionality for data backup
- Use compression for large datasets when necessary

```typescript
// Example storage utility
class ChatStorage {
  private static readonly PREFIX = 'aisdk_'
  
  static saveChat(chatId: string, messages: ChatMessage[]) {
    try {
      const key = `${this.PREFIX}chat_${chatId}`
      localStorage.setItem(key, JSON.stringify(messages))
    } catch (error) {
      console.error('Failed to save chat:', error)
    }
  }
}
```

---

## PDF.js + Cheerio

### Best Practices
- **Worker Configuration**: Use PDF.js worker for better performance
- **Memory Management**: Dispose of PDF documents after processing
- **Text Extraction**: Extract text with position information for better chunking
- **Error Handling**: Handle corrupted or password-protected PDFs gracefully
- **Progress Tracking**: Show progress for large document processing

### Limitations & Pitfalls
- **Bundle Size**: PDF.js adds significant bundle weight (~2MB)
- **Memory Usage**: Large PDFs can consume substantial memory
- **Browser Compatibility**: Some features require modern browser APIs
- **OCR Limitation**: Cannot extract text from image-based PDFs
- **Complex Layouts**: May struggle with complex document layouts

### Conventions
- Process PDFs on separate thread/worker when possible
- Implement chunking strategy based on document structure
- Validate PDF files before processing
- Provide fallback for unsupported document types

---

## Shadcn/ui + Tailwind CSS

### Best Practices
- **Component Composition**: Build complex UIs from simple, reusable components
- **Theme Consistency**: Use CSS custom properties for consistent theming
- **Responsive Design**: Use Tailwind's responsive prefixes consistently
- **Accessibility**: Leverage Shadcn's built-in accessibility features
- **Performance**: Use Tailwind's purge feature to remove unused styles

### Limitations & Pitfalls
- **Learning Curve**: Tailwind utility classes require memorization
- **Bundle Size**: Can grow large without proper purging
- **Customization Complexity**: Deep customization may require CSS knowledge
- **Class Name Conflicts**: Potential conflicts with other CSS frameworks
- **Maintenance**: Long className strings can be hard to maintain

### Conventions
- Use Shadcn components as base, customize with Tailwind utilities
- Follow consistent spacing scale (4px increments)
- Use semantic color names in theme configuration
- Group related utilities together in className strings

```typescript
// Example component usage
<Card className="w-full max-w-md mx-auto p-6 space-y-4">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Chat Message</CardTitle>
  </CardHeader>
  <CardContent className="prose prose-sm max-w-none">
    {content}
  </CardContent>
</Card>
```

---

## Zustand State Management

### Best Practices
- **Store Slicing**: Create focused stores for different app domains
- **Immutable Updates**: Use immer middleware for complex state updates
- **Persistence**: Use persist middleware for chat history and user preferences
- **TypeScript Integration**: Define strict types for all store state
- **Devtools**: Enable Redux DevTools for debugging

### Limitations & Pitfalls
- **No Built-in Structure**: Requires discipline to maintain organized state
- **Subscription Performance**: Avoid creating too many fine-grained subscriptions
- **State Normalization**: Manual normalization for complex relational data
- **Testing Complexity**: Store testing requires careful setup and teardown
- **Memory Leaks**: Unsubscribed listeners can cause memory leaks

### Conventions
- Use descriptive action names (`addMessage`, `updateChatMode`)
- Group related state and actions together
- Implement loading and error states consistently
- Use selectors to prevent unnecessary re-renders

```typescript
// Example store definition
interface ChatStore {
  messages: ChatMessage[]
  isLoading: boolean
  currentMode: 'tools' | 'agents' | 'auto'
  addMessage: (message: ChatMessage) => void
  setMode: (mode: ChatStore['currentMode']) => void
}

const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  currentMode: 'tools',
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setMode: (mode) => set({ currentMode: mode })
}))
```

---

## Development Tools (ESLint + Prettier + Vitest)

### Best Practices
- **Configuration Consistency**: Use shared configs across team/projects
- **Pre-commit Hooks**: Automatically format and lint before commits
- **Test Coverage**: Aim for >80% coverage on critical paths
- **Performance Testing**: Test AI streaming and async operations
- **Integration Testing**: Test full user flows with React Testing Library

### Limitations & Pitfalls
- **Configuration Conflicts**: ESLint and Prettier rules can conflict
- **Slow Builds**: Extensive linting can slow development builds
- **Test Flakiness**: Async AI operations can create flaky tests
- **Mock Complexity**: Mocking AI SDK and external services is complex
- **Coverage Gaps**: Hard to test error conditions in AI interactions

### Conventions
- Use `.eslintrc.js` for complex configuration
- Configure Prettier in `package.json` for simplicity
- Place tests adjacent to source files (`*.test.tsx`)
- Use descriptive test names that explain behavior
- Mock external services at the boundary level

---

## Common Integration Patterns

### AI Streaming + State Management
```typescript
const { messages, append, isLoading } = useChat({
  api: '/api/chat',
  onFinish: (message) => {
    // Update Zustand store with final message
    useChatStore.getState().addMessage(message)
  }
})
```

### Error Boundaries for AI Operations
```typescript
class AIErrorBoundary extends Component {
  componentDidCatch(error: Error) {
    if (error.message.includes('rate_limit')) {
      // Handle rate limiting
    } else if (error.message.includes('context_length')) {
      // Handle token limits
    }
  }
}
```

### Vector Search + Chat Integration
```typescript
const handleMessage = async (content: string) => {
  // Retrieve relevant documents
  const docs = await searchVectors(content)
  
  // Include in chat context
  const response = await append({
    content,
    context: docs
  })
}
```

This guide serves as the definitive reference for implementation decisions and troubleshooting throughout the project development.
