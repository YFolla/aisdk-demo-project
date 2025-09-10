# AI Lab - Vercel AI SDK Playground

A comprehensive playground for exploring Vercel AI SDK capabilities including streaming chat, tool calling, agents, and multimodal interactions. This project demonstrates how to build modern AI-powered applications using Next.js 14, TypeScript, and the latest AI SDK primitives.

## 🚀 Project Overview

This project is a speed build challenge to create a unified AI Lab that demonstrates the full range of capabilities in the Vercel AI SDK. The goal is not production polish, but rather to explore how modern AI SDK primitives—streaming, tool calling, structured output, embeddings, multimodal models, and provider swapping—work together in one place.

### Current Status: Phase 0 Complete ✅

**Phase 0: Basic Setup** - A barebones Next.js application with basic AI SDK integration that can handle simple chat interactions.

**Features Implemented:**
- ✅ Next.js 14 with App Router and TypeScript
- ✅ Streaming chat interface with AI SDK
- ✅ Dark/light theme support with system preference detection
- ✅ Basic error handling and loading states
- ✅ Developer view toggle for debugging
- ✅ Responsive design with mobile-first approach
- ✅ State management with Zustand
- ✅ UI components with Shadcn/ui and Tailwind CSS

## 🏗️ Architecture & Conventions

This is an **AI-first codebase** following modular architecture principles:

- **Files under 500 lines maximum**
- **Descriptive file and function names**
- **@fileoverview comments** at top of files
- **Kebab-case file naming** (e.g., chat-interface.tsx)
- **Comprehensive TypeScript typing**
- **Import organization**: external → internal types → utilities → components → hooks → stores

### Directory Structure

```
/
├── app/                    # Next.js App Router with API routes
├── components/             # Reusable UI components by feature
│   ├── ui/                # Shadcn base components
│   ├── chat/              # Chat interface components
│   ├── theme/             # Theme provider components
│   └── layout/            # Layout components
├── lib/                   # Core business logic and utilities
├── hooks/                 # Custom React hooks
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
├── constants/             # Application constants and config
└── _docs/                 # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict settings
- **AI SDK**: Vercel AI SDK with OpenAI integration
- **Styling**: Tailwind CSS with custom theme system
- **UI Components**: Shadcn/ui with Radix UI primitives
- **State Management**: Zustand with persistence
- **Code Quality**: ESLint, Prettier with AI-friendly configs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key (for AI functionality)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the application

### Usage

- **Chat Interface**: Type messages to interact with the AI
- **Theme Toggle**: Click the theme button in the header to switch between light/dark/system themes
- **Developer View**: Click the code button to see debug information, token usage, and request details

## 📋 Upcoming Phases

- **Phase 1**: Tool calling with weather and currency utilities
- **Phase 2**: RAG integration with document upload and vector search
- **Phase 3**: Multimodal extensions with image generation and analysis
- **Phase 4**: Agent orchestration with specialized subagents
- **Phase 5**: Manual mode toggling (Tools vs Agents vs Auto)
- **Phase 6**: Auto-routing with intelligent mode selection

## 📚 Documentation

- [Project Overview](_docs/project-overview.md) - Goals and phase breakdown
- [Project Rules](_docs/project-rules.md) - Coding standards and conventions
- [Tech Stack](_docs/tech-stack.md) - Technology best practices
- [UI Rules](_docs/ui-rules.md) - Design principles and patterns
- [Theme Rules](_docs/theme-rules.md) - Color system and styling
- [User Flow](_docs/user-flow.md) - Navigation patterns

## 🤝 Contributing

This project follows strict coding conventions optimized for AI tools and semantic search. Please review the project rules and conventions in the `_docs/` directory before contributing.

## 📄 License

This project is for educational and demonstration purposes.
