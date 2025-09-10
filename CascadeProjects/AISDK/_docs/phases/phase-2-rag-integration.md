es # Phase 2: RAG Integration

**Goal**: Add Retrieval-Augmented Generation (RAG) capabilities with document processing, vector storage, and contextual retrieval. This phase transforms the chat into a knowledge-enhanced assistant that can reason over uploaded documents.

**Duration**: 4-5 days

**Success Criteria**: 
- Users can upload PDFs and URLs for processing
- Documents are chunked, embedded, and stored in Pinecone
- AI can retrieve relevant context during conversations
- Citations appear with source references and snippets
- Document management works across sessions

---

## Features & Tasks

### 1. **Document Processing Pipeline**
**Objective**: Implement PDF and URL content extraction with chunking

**Steps**:
1. Set up PDF.js for client-side PDF text extraction
2. Implement Cheerio-based URL content scraping
3. Create semantic chunking algorithm for optimal context windows
4. Build document preprocessing pipeline (cleaning, formatting)
5. Add progress tracking and error handling for large documents

**Deliverables**:
- PDF text extraction with metadata preservation
- URL content scraping with title/description extraction
- Semantic chunking that respects document structure
- Document processing status indicators
- Error handling for corrupted/protected files

### 2. **Vector Database Integration**
**Objective**: Set up Pinecone for embedding storage and similarity search

**Steps**:
1. Configure Pinecone client with proper indexing strategy
2. Implement OpenAI embedding generation for text chunks
3. Create batch upsert operations for efficient vector storage
4. Build vector similarity search with metadata filtering
5. Add embedding caching to avoid duplicate processing

**Deliverables**:
- Pinecone vector database properly configured
- Embedding generation with OpenAI text-embedding-3-small
- Efficient batch operations for large documents
- Fast similarity search with metadata filtering
- Embedding cache to reduce API costs

### 3. **Document Upload Interface**
**Objective**: Create user-friendly document upload and management system

**Steps**:
1. Build drag-and-drop file upload component
2. Add URL input for web page processing
3. Create document processing status display with progress bars
4. Implement document library with search and filtering
5. Add document deletion and re-processing capabilities

**Deliverables**:
- Drag-and-drop file upload with validation
- URL processing with preview generation
- Real-time processing status updates
- Document library with management features
- File type validation and size limits

### 4. **Contextual Retrieval System**
**Objective**: Integrate RAG into chat flow with automatic context retrieval

**Steps**:
1. Create `retrieveDocs` tool for AI to search knowledge base
2. Implement query enhancement for better vector search results
3. Build context ranking and relevance scoring
4. Add automatic retrieval based on conversation context
5. Create fallback strategies when no relevant context is found

**Deliverables**:
- AI tool for autonomous document retrieval
- Enhanced search queries with context awareness
- Relevance scoring for retrieved chunks
- Automatic context injection into conversations
- Graceful handling when no context is available

### 5. **Citation Display System**
**Objective**: Show source references with snippets and navigation

**Steps**:
1. Create citation card components with source metadata
2. Build snippet highlighting for relevant passages
3. Add navigation to original document sections
4. Implement citation confidence scoring
5. Create citation aggregation for multiple sources

**Deliverables**:
- Citation cards with source information and snippets
- Highlighted relevant passages within citations
- Links to original document sections
- Confidence indicators for citation quality
- Multiple citation handling and deduplication

---

## Enhanced Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Enhanced with RAG context
│   │   ├── documents/
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # File upload handler
│   │   │   ├── process/
│   │   │   │   └── route.ts      # Document processing
│   │   │   └── search/
│   │   │       └── route.ts      # Vector search endpoint
│   │   └── embeddings/
│   │       ├── generate/
│   │       │   └── route.ts      # Embedding generation
│   │       └── upsert/
│   │           └── route.ts      # Vector storage
│   └── documents/
│       └── page.tsx              # Document management page
├── components/
│   ├── documents/
│   │   ├── document-upload.tsx   # Drag-drop upload interface
│   │   ├── document-library.tsx  # Document management
│   │   ├── processing-status.tsx # Upload progress display
│   │   ├── url-processor.tsx     # URL input and processing
│   │   └── document-preview.tsx  # Document content preview
│   ├── citations/
│   │   ├── citation-card.tsx     # Source reference display
│   │   ├── citation-snippet.tsx  # Highlighted text passages
│   │   └── citation-list.tsx     # Multiple citations container
│   ├── rag/
│   │   ├── context-display.tsx   # Retrieved context visualization
│   │   ├── relevance-score.tsx   # Citation confidence indicators
│   │   └── search-results.tsx    # Vector search results
│   └── chat/
│       └── rag-enhanced-bubble.tsx # Messages with citations
├── lib/
│   ├── documents/
│   │   ├── pdf-processor.ts      # PDF.js integration
│   │   ├── url-scraper.ts        # Cheerio web scraping
│   │   ├── chunking.ts           # Semantic text chunking
│   │   └── preprocessing.ts      # Text cleaning and formatting
│   ├── embeddings/
│   │   ├── pinecone-client.ts    # Pinecone database client
│   │   ├── openai-embeddings.ts  # OpenAI embedding generation
│   │   ├── vector-search.ts      # Similarity search logic
│   │   └── embedding-cache.ts    # Caching for duplicate content
│   ├── rag/
│   │   ├── retrieval.ts          # Document retrieval logic
│   │   ├── context-ranking.ts    # Relevance scoring
│   │   ├── query-enhancement.ts  # Search query optimization
│   │   └── citation-generator.ts # Citation formatting
│   └── tools/
│       └── retrieve-docs.ts      # RAG tool for AI
├── stores/
│   ├── document-store.ts         # Document management state
│   ├── embedding-store.ts        # Vector search state
│   └── citation-store.ts         # Citation display state
├── types/
│   ├── documents.ts              # Document and chunk types
│   ├── embeddings.ts             # Vector and search types
│   └── citations.ts              # Citation and source types
└── hooks/
    ├── use-document-upload.ts    # File upload management
    ├── use-vector-search.ts      # Search functionality
    └── use-citation-display.ts   # Citation state management
```

---

## New Environment Variables

```bash
# Existing variables...
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=ai-lab-vectors

# Document Processing
MAX_FILE_SIZE=10485760          # 10MB
MAX_CHUNK_SIZE=1000
CHUNK_OVERLAP=200
MAX_DOCUMENTS_PER_USER=100

# RAG Configuration
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
MAX_RETRIEVAL_RESULTS=5
SIMILARITY_THRESHOLD=0.7
```

---

## Key Components Implementation

### Document Processing Pipeline
```typescript
// lib/documents/pdf-processor.ts
/**
 * @fileoverview PDF text extraction and metadata processing
 */

export async function processPDF(file: File): Promise<DocumentProcessingResult> {
  const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise
  const pages: string[] = []
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map(item => 'str' in item ? item.str : '')
      .join(' ')
    pages.push(pageText)
  }
  
  return {
    title: file.name,
    content: pages.join('\n'),
    pageCount: pdf.numPages,
    metadata: {
      source: 'pdf',
      filename: file.name,
      size: file.size,
      processedAt: new Date()
    }
  }
}
```

### RAG Tool Implementation
```typescript
// lib/tools/retrieve-docs.ts
/**
 * @fileoverview Document retrieval tool for AI context enhancement
 */

export const retrieveDocsTool = {
  name: 'retrieve_docs',
  description: 'Search knowledge base for relevant information',
  parameters: z.object({
    query: z.string().describe('Search query for relevant documents'),
    maxResults: z.number().optional().default(5),
    threshold: z.number().optional().default(0.7)
  }),
  execute: async ({ query, maxResults, threshold }) => {
    const searchResults = await searchVectors(query, {
      topK: maxResults,
      threshold,
      includeMetadata: true
    })
    
    return {
      results: searchResults.map(result => ({
        content: result.chunk,
        source: result.metadata.source,
        title: result.metadata.title,
        page: result.metadata.page,
        score: result.score
      })),
      totalResults: searchResults.length,
      query: query
    }
  }
}
```

### Citation Card Component
```typescript
// components/citations/citation-card.tsx
/**
 * @fileoverview Citation display with source information and snippets
 */

interface CitationCardProps {
  citation: Citation
  snippet: string
  score: number
  onNavigate?: () => void
}

export function CitationCard({ citation, snippet, score, onNavigate }: CitationCardProps) {
  return (
    <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {citation.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {Math.round(score * 100)}% match
            </Badge>
            {onNavigate && (
              <Button variant="ghost" size="sm" onClick={onNavigate}>
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <blockquote className="text-sm italic border-l-2 border-amber-300 pl-3">
          {snippet}
        </blockquote>
        <div className="text-xs text-muted-foreground mt-2">
          {citation.source === 'pdf' ? `Page ${citation.page}` : citation.url}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Testing Phase 2

**Document Processing Tests**:
- [ ] PDF upload and text extraction works correctly
- [ ] URL processing captures main content and metadata
- [ ] Large documents process without memory issues
- [ ] Chunking preserves document structure and context
- [ ] Progress indicators update during processing

**Vector Search Tests**:
- [ ] Embeddings generate correctly for text chunks
- [ ] Pinecone upsert operations complete successfully
- [ ] Vector search returns relevant results
- [ ] Similarity scoring works as expected
- [ ] Metadata filtering functions properly

**RAG Integration Tests**:
- [ ] AI can call retrieve_docs tool automatically
- [ ] Retrieved context enhances AI responses
- [ ] Citations appear with correct source information
- [ ] Multiple documents can be searched simultaneously
- [ ] Context ranking prioritizes most relevant sources

**User Scenarios**:
1. **Document Upload**: Upload PDF, verify processing and storage
2. **URL Processing**: Add webpage, verify content extraction
3. **Knowledge Query**: Ask question about uploaded document
4. **Multi-Document Search**: Query across multiple sources
5. **Citation Navigation**: Click citation to view source
6. **Document Management**: Delete document, verify removal from search

**Performance Tests**:
- [ ] Document processing completes within reasonable time
- [ ] Vector search returns results under 2 seconds
- [ ] Large document libraries remain searchable
- [ ] Embedding generation doesn't exceed rate limits

---

## Known Limitations

- PDF processing limited to text-based documents (no OCR)
- URL scraping may fail on JavaScript-heavy sites
- Pinecone costs scale with document volume
- No document versioning or update detection
- Limited to English language processing
- No collaborative document sharing

---

## Next Phase Preview

Phase 3 will add multimodal capabilities including:
- Image generation via DALL-E or Stable Diffusion
- Image analysis and description tools
- Visual content integration in chat flow
- Gallery display for generated images
- Provider switching for image models
