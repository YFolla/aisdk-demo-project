# User Flow

This document outlines the user journey through the AI Lab application, designed for local testing and exploration of Vercel AI SDK capabilities.

---

## Core User Journey

### 1. Application Entry
- User starts the local development server
- Lands directly on the main chat interface
- Previous chat sessions are automatically loaded from local storage
- Clean, focused UI with chat input prominently displayed

### 2. Chat Interface Interaction
- **Primary Action**: Type message in chat input
- **Real-time Feedback**: Streaming responses appear as they're generated
- **Tool Integration**: Model automatically calls utility tools (weather, currency, etc.) when relevant
- **Structured Outputs**: Results display as cards in right-side panel
- **Developer View Toggle**: Optional detailed view showing tool invocations and model response flow

### 3. Document & Knowledge Management (RAG Flow)
- **File Upload**: Drag & drop PDFs or paste URLs into chat
- **Processing Feedback**: Visual indication of chunking → embedding → indexing
- **Contextual Retrieval**: Model automatically searches relevant documents during conversation
- **Citation Display**: Source snippets appear as cards with reference links
- **Knowledge Building**: Each uploaded document enriches the knowledge base for future chats

### 4. Multimodal Workflows
- **Image Generation**: Request images via natural language → gallery display
- **Image Analysis**: Upload/paste images → structured analysis with JSON tags
- **Provider Switching**: Toggle between different AI providers (OpenAI, Fireworks, Replicate)
- **Mixed Results**: Text, citations, and images unified in single conversation stream

### 5. Agent Orchestration
- **Mode Selection**: Choose between Tools-only, Agents, or Auto modes
- **Complex Tasks**: Agent system automatically spawns specialized subagents (Planner, RAGer, VisionTagger, Synthesizer)
- **Agent Tree Visualization**: Developer View shows delegation hierarchy and parallel processing
- **Quality vs Speed**: Tools mode for quick responses, Agents mode for complex multi-step tasks

### 6. Auto-Routing Intelligence
- **Smart Detection**: System analyzes prompt complexity and chooses appropriate mode
- **Fallback Strategy**: Automatic reversion to Tools if Agents exceed time/cost thresholds
- **Transparency**: Developer View reveals decision criteria and routing logic
- **Performance Metrics**: Track latency, cost, and effectiveness over time

---

## Navigation Patterns

### Primary Interface Elements
- **Chat Input**: Always accessible at bottom
- **Message History**: Scrollable conversation thread
- **Right Panel**: Contextual cards (structured outputs, citations, images)
- **Developer View**: Collapsible detailed technical information
- **Mode Selector**: Tools/Agents/Auto toggle
- **Provider Selector**: AI model/service switching

### Session Management
- **Auto-Save**: Conversations persist automatically to local storage
- **Chat History**: Access previous sessions via sidebar or dropdown
- **Document Memory**: Uploaded files remain available across sessions
- **State Restoration**: Return to exact conversation state on app restart

### Information Architecture
- **Linear Chat Flow**: Primary interaction follows conversational pattern
- **Contextual Panels**: Supporting information appears alongside main thread
- **Progressive Enhancement**: Advanced features (agents, developer view) available but not intrusive
- **Unified Results**: All output types (text, tools, images, citations) integrated into single stream

---

## Key User Scenarios

### Scenario 1: Quick Utility Tasks
1. Open chat → Ask for weather/currency conversion
2. Tool automatically called → Results in right panel
3. Continue conversation with context maintained

### Scenario 2: Research with Documents
1. Upload PDF/URL → Processing confirmation
2. Ask questions about content → RAG retrieval + citations
3. Build on knowledge across multiple documents

### Scenario 3: Creative + Analysis Work
1. Request image generation → Gallery display
2. Upload image for analysis → Structured tags + description
3. Combine text and visual insights in ongoing conversation

### Scenario 4: Complex Problem Solving
1. Switch to Agents mode → Submit multi-step request
2. Watch agent tree in Developer View → See subagent coordination
3. Receive comprehensive structured response

### Scenario 5: Comparative Testing
1. Enable Auto mode → Submit same query multiple times
2. Observe routing decisions → Compare Tools vs Agents results
3. Review performance metrics → Optimize for specific use cases

---

## Success Metrics

- **Seamless Tool Integration**: Tools feel natural, not forced
- **Contextual Relevance**: RAG retrieval provides accurate, helpful sources
- **Mode Transparency**: Clear understanding of when/why different modes activate
- **Session Continuity**: Smooth experience across app restarts
- **Developer Insights**: Rich debugging information when needed
