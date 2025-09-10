# Phase 3: Multimodal Extensions

**Goal**: Expand the AI Lab with image generation and analysis capabilities, creating a unified multimodal experience where text, documents, and images work together seamlessly in the conversation flow.

**Duration**: 4-5 days

**Success Criteria**: 
- Users can generate images through natural language requests
- Image analysis provides structured descriptions and tags
- Generated images display in an integrated gallery
- Multiple AI providers work for image generation and vision
- Multimodal results integrate smoothly with existing chat flow

---

## Features & Tasks

### 1. **Image Generation System**
**Objective**: Implement AI-powered image generation with multiple provider support

**Steps**:
1. Set up OpenAI DALL-E 3 integration for image generation
2. Add Replicate integration for Stable Diffusion models
3. Create image generation tool with prompt optimization
4. Implement image storage and URL management
5. Add generation parameters (size, style, quality) configuration

**Deliverables**:
- Multi-provider image generation (OpenAI, Replicate)
- Optimized prompt processing for better results
- Image storage with proper URL handling
- Configurable generation parameters
- Error handling for generation failures

### 2. **Image Analysis and Vision**
**Objective**: Add image understanding capabilities with structured output

**Steps**:
1. Integrate OpenAI GPT-4 Vision for image analysis
2. Create structured image description with JSON tags
3. Build image upload interface with drag-and-drop
4. Implement image preprocessing and optimization
5. Add batch image analysis for multiple files

**Deliverables**:
- Image analysis with detailed descriptions
- Structured JSON output with tags and metadata
- Image upload interface with validation
- Image preprocessing for optimal analysis
- Batch processing capabilities

### 3. **Gallery and Media Management**
**Objective**: Create visual gallery for generated and analyzed images

**Steps**:
1. Build responsive image gallery with grid layout
2. Create image detail view with metadata and actions
3. Implement image search and filtering by tags
4. Add image download and sharing capabilities
5. Create image history and favorites system

**Deliverables**:
- Responsive image gallery with grid/list views
- Image detail modal with full metadata
- Search and filtering by tags and descriptions
- Download and sharing functionality
- Image history and organization features

### 4. **Provider Management System**
**Objective**: Enable switching between different AI providers for images

**Steps**:
1. Create provider abstraction layer for image services
2. Build provider selection UI with capabilities display
3. Implement provider-specific parameter handling
4. Add cost and performance comparison features
5. Create provider fallback strategies for failures

**Deliverables**:
- Unified interface for multiple image providers
- Provider selection with capability comparison
- Provider-specific configuration management
- Cost and performance tracking per provider
- Automatic fallback for provider failures

### 5. **Multimodal Chat Integration**
**Objective**: Seamlessly integrate images into the conversation flow

**Steps**:
1. Enhance message bubbles to display images inline
2. Create mixed content cards for text + image responses
3. Implement image references in conversation context
4. Add image-based follow-up question capabilities
5. Create conversation export with embedded images

**Deliverables**:
- Chat messages with embedded images
- Mixed content display for complex responses
- Image context preservation in conversations
- Image-aware follow-up interactions
- Complete conversation export including media

---

## Enhanced Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── images/
│   │   │   ├── generate/
│   │   │   │   └── route.ts      # Image generation endpoint
│   │   │   ├── analyze/
│   │   │   │   └── route.ts      # Image analysis endpoint
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # Image upload handler
│   │   │   └── providers/
│   │   │       ├── openai/
│   │   │       │   └── route.ts  # OpenAI image services
│   │   │       └── replicate/
│   │   │           └── route.ts  # Replicate integration
│   │   └── chat/
│   │       └── route.ts          # Enhanced with image context
│   └── gallery/
│       └── page.tsx              # Image gallery page
├── components/
│   ├── images/
│   │   ├── image-generator.tsx   # Generation interface
│   │   ├── image-analyzer.tsx    # Analysis interface
│   │   ├── image-gallery.tsx     # Gallery grid layout
│   │   ├── image-card.tsx        # Individual image display
│   │   ├── image-detail.tsx      # Full-screen image view
│   │   ├── image-upload.tsx      # Upload interface
│   │   └── provider-selector.tsx # Image provider switching
│   ├── multimodal/
│   │   ├── mixed-content-card.tsx # Text + image responses
│   │   ├── image-message.tsx     # Image in chat bubble
│   │   ├── generation-progress.tsx # Image generation status
│   │   └── vision-result.tsx     # Structured analysis display
│   ├── gallery/
│   │   ├── gallery-grid.tsx      # Responsive image grid
│   │   ├── gallery-filters.tsx   # Search and filter controls
│   │   ├── gallery-toolbar.tsx   # Actions and view options
│   │   └── image-metadata.tsx    # Image information display
│   └── chat/
│       └── multimodal-bubble.tsx # Enhanced message bubbles
├── lib/
│   ├── images/
│   │   ├── providers/
│   │   │   ├── openai-images.ts  # DALL-E integration
│   │   │   ├── replicate.ts      # Stable Diffusion models
│   │   │   └── provider-registry.ts # Provider management
│   │   ├── generation.ts         # Image generation logic
│   │   ├── analysis.ts           # Vision and analysis
│   │   ├── storage.ts            # Image storage management
│   │   └── optimization.ts       # Image processing utilities
│   ├── vision/
│   │   ├── gpt4-vision.ts        # GPT-4 Vision integration
│   │   ├── structured-analysis.ts # JSON output formatting
│   │   └── batch-processing.ts   # Multiple image analysis
│   └── tools/
│       ├── generate-image.ts     # Image generation tool
│       └── describe-image.ts     # Image analysis tool
├── stores/
│   ├── image-store.ts            # Image generation and gallery state
│   ├── provider-store.ts         # Provider selection and config
│   └── multimodal-store.ts       # Mixed content state
├── types/
│   ├── images.ts                 # Image generation and analysis types
│   ├── providers.ts              # Provider configuration types
│   └── multimodal.ts             # Mixed content types
└── hooks/
    ├── use-image-generation.ts   # Image generation state
    ├── use-image-analysis.ts     # Vision analysis hooks
    ├── use-gallery.ts            # Gallery management
    └── use-provider-switching.ts # Provider selection
```

---

## New Environment Variables

```bash
# Existing variables...
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Image Generation
OPENAI_DALLE_MODEL=dall-e-3
REPLICATE_API_TOKEN=your_replicate_token_here
STABLE_DIFFUSION_MODEL=stability-ai/sdxl

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Image Processing
MAX_IMAGE_SIZE=10485760         # 10MB
SUPPORTED_IMAGE_FORMATS=jpg,jpeg,png,webp,gif
MAX_GENERATION_REQUESTS_PER_HOUR=20
DEFAULT_IMAGE_SIZE=1024x1024

# Vision Analysis
GPT4_VISION_MODEL=gpt-4-vision-preview
MAX_VISION_REQUESTS_PER_MINUTE=10
VISION_DETAIL_LEVEL=high
```

---

## Key Components Implementation

### Image Generation Tool
```typescript
// lib/tools/generate-image.ts
/**
 * @fileoverview AI tool for generating images from text descriptions
 */

export const generateImageTool = {
  name: 'generate_image',
  description: 'Generate an image from a text description',
  parameters: z.object({
    prompt: z.string().describe('Detailed description of the image to generate'),
    size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
    style: z.enum(['vivid', 'natural']).optional(),
    provider: z.enum(['openai', 'replicate']).optional()
  }),
  execute: async ({ prompt, size = '1024x1024', style = 'vivid', provider = 'openai' }) => {
    const imageProvider = getImageProvider(provider)
    
    try {
      const result = await imageProvider.generateImage({
        prompt,
        size,
        style,
        quality: 'hd'
      })
      
      // Store image metadata
      const imageRecord = await storeImageMetadata({
        url: result.url,
        prompt,
        provider,
        size,
        style,
        generatedAt: new Date(),
        revisedPrompt: result.revisedPrompt
      })
      
      return {
        success: true,
        imageUrl: result.url,
        revisedPrompt: result.revisedPrompt,
        imageId: imageRecord.id,
        metadata: {
          size,
          style,
          provider,
          generatedAt: imageRecord.generatedAt
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Image generation failed: ${error.message}`,
        prompt
      }
    }
  }
}
```

### Image Analysis Tool
```typescript
// lib/tools/describe-image.ts
/**
 * @fileoverview AI tool for analyzing and describing images
 */

export const describeImageTool = {
  name: 'describe_image',
  description: 'Analyze an image and provide detailed description with structured tags',
  parameters: z.object({
    imageUrl: z.string().url().describe('URL of the image to analyze'),
    detailLevel: z.enum(['low', 'high']).optional().default('high'),
    includeText: z.boolean().optional().default(true),
    generateTags: z.boolean().optional().default(true)
  }),
  execute: async ({ imageUrl, detailLevel, includeText, generateTags }) => {
    try {
      const analysis = await analyzeImageWithGPT4Vision({
        imageUrl,
        prompt: `Analyze this image in detail. ${includeText ? 'Include any text you see.' : ''} ${generateTags ? 'Generate relevant tags.' : ''}`,
        detail: detailLevel
      })
      
      const structuredResult = {
        description: analysis.description,
        objects: analysis.objects || [],
        colors: analysis.colors || [],
        mood: analysis.mood || 'neutral',
        style: analysis.style || 'unknown',
        text: includeText ? analysis.extractedText || [] : [],
        tags: generateTags ? analysis.tags || [] : [],
        confidence: analysis.confidence || 0.8,
        analysisMetadata: {
          model: 'gpt-4-vision-preview',
          detailLevel,
          analyzedAt: new Date()
        }
      }
      
      return {
        success: true,
        analysis: structuredResult,
        imageUrl
      }
    } catch (error) {
      return {
        success: false,
        error: `Image analysis failed: ${error.message}`,
        imageUrl
      }
    }
  }
}
```

### Multimodal Message Component
```typescript
// components/multimodal/mixed-content-card.tsx
/**
 * @fileoverview Display component for messages containing both text and images
 */

interface MixedContentCardProps {
  content: string
  images?: GeneratedImage[]
  analysis?: ImageAnalysis[]
  citations?: Citation[]
}

export function MixedContentCard({ content, images, analysis, citations }: MixedContentCardProps) {
  return (
    <div className="space-y-4">
      {/* Text content */}
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      
      {/* Generated images */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <img 
                  src={image.url} 
                  alt={image.prompt}
                  className="w-full rounded-lg mb-2"
                />
                <p className="text-xs text-muted-foreground italic">
                  "{image.revisedPrompt || image.prompt}"
                </p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary">{image.provider}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Image analysis results */}
      {analysis && analysis.length > 0 && (
        <div className="space-y-2">
          {analysis.map((result, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={result.imageUrl} 
                    alt="Analyzed image"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{result.analysis.description}</p>
                    {result.analysis.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.analysis.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Citations (from previous phase) */}
      {citations && citations.length > 0 && (
        <div className="space-y-2">
          {citations.map((citation) => (
            <CitationCard key={citation.id} citation={citation} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Testing Phase 3

**Image Generation Tests**:
- [ ] DALL-E 3 generates images from text prompts
- [ ] Replicate Stable Diffusion integration works
- [ ] Generated images display correctly in chat
- [ ] Image metadata is stored and retrievable
- [ ] Provider switching works seamlessly

**Image Analysis Tests**:
- [ ] GPT-4 Vision analyzes uploaded images
- [ ] Structured analysis includes tags and descriptions
- [ ] Text extraction from images works correctly
- [ ] Batch image analysis processes multiple files
- [ ] Analysis results integrate with chat flow

**Gallery and UI Tests**:
- [ ] Image gallery displays generated and analyzed images
- [ ] Gallery search and filtering works by tags
- [ ] Image detail view shows complete metadata
- [ ] Download functionality works for all image types
- [ ] Responsive design works on mobile devices

**Multimodal Integration Tests**:
- [ ] Mixed content displays text and images together
- [ ] Image references work in conversation context
- [ ] Follow-up questions about images work correctly
- [ ] Conversation export includes embedded images
- [ ] Provider costs are tracked accurately

**User Scenarios**:
1. **Image Generation**: "Create an image of a futuristic city" → verify generation and display
2. **Image Analysis**: Upload photo → verify detailed analysis with tags
3. **Mixed Conversation**: Generate image, then ask questions about it
4. **Provider Comparison**: Generate same prompt with different providers
5. **Gallery Management**: Search images by tags, download favorites
6. **Multimodal RAG**: Upload document with images, ask questions about visual content

**Performance Tests**:
- [ ] Image generation completes within 30 seconds
- [ ] Image analysis returns results within 10 seconds
- [ ] Gallery loads quickly with many images
- [ ] Image uploads handle large files efficiently
- [ ] Provider switching doesn't interrupt ongoing operations

---

## Known Limitations

- Image generation costs can accumulate quickly
- GPT-4 Vision has usage rate limits
- Image storage requires external service (Cloudinary)
- No video or audio processing capabilities
- Limited to static image analysis (no real-time processing)
- Provider-specific feature differences may confuse users

---

## Next Phase Preview

Phase 4 will introduce agent orchestration including:
- Specialized subagents (Planner, RAGer, VisionTagger, Synthesizer)
- Agent delegation and coordination system
- Agent tree visualization in Developer View
- Parallel agent execution with result synthesis
- Agent retry and error recovery mechanisms
