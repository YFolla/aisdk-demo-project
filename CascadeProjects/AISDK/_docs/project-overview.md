# Project Overview

This project is a speed build challenge to create a unified AI Lab that demonstrates the full range of capabilities in the Vercel AI SDK. The goal is not production polish, but rather to explore how modern AI SDK primitives—streaming, tool calling, structured output, embeddings, multimodal models, and provider swapping—work together in one place.

---

## Phase 1: Core Chat + Tools

Build a unified chat interface with the following essential features:
	•	Streaming chat UI powered by useChat
	•	Tool calling for small utility functions (e.g., weather, currency conversion)
	•	Structured outputs rendered as cards in a right-side panel
	•	Developer View that shows each tool invocation and model response flow for debugging and learning

---

## Phase 2: Retrieval-Augmented Generation (RAG)

Enhance the chat with contextual knowledge retrieval:
	•	File ingestion (PDF/URL upload → chunking → embeddings)
	•	Vector search retriever backed by SQLite/Drizzle
	•	Citation cards with snippets and sources rendered in the UI
	•	Tool integration where the model can call retrieveDocs during conversation

---

## Phase 3: Multimodal Extensions

Expand the assistant into image workflows:
	•	Image generation via generateImage tool, displayed in a gallery
	•	Image understanding via describeImage tool with structured JSON tags
	•	Structured UI events unify text, citations, and gallery results in one stream
	•	Provider toggling for image and vision models (OpenAI, Fireworks, Replicate, etc.)

---

## Phase 4: Agents and Subagents

Introduce a second layer of orchestration with Claude Code–style agents:
	•	Agent registry with specialized subagents (Planner, RAGer, VisionTagger, Synthesizer)
	•	Orchestrator that can spawn subagents and merge their outputs
	•	Agent tree visualization in the Developer View, showing delegation, retries, and tool calls
	•	Parallelism & iteration: agents can refine or retry internally before returning structured UI events

---

## Phase 5: Manual Toggling

Enable side-by-side comparison of Tools vs. Agents:
	•	Mode toggle in the UI (Tools-only ↔ Agents ↔ Auto)
	•	Tools-only: lowest latency/cost, atomic tool calls
	•	Agents: multi-step decomposition, higher quality for complex tasks
	•	Developer View enhancements to display which mode was chosen and why

---

## Phase 6: Auto-Routing and Fallbacks

Add intelligence to decide when to use agents:
	•	Auto-router that scores user prompts (multi-constraints, open-ended research, RAG depth) and picks Tools or Agents
	•	Fallback strategy: if agents exceed time, cost, or confidence thresholds, revert to Tools
	•	Transparency: Developer View shows decision criteria, signals, and fallbacks
	•	Metrics: collect latency, cost, and feedback to refine the router

---

## Ultimate Goal

Deliver an AI Lab Playground that demonstrates how to:
	•	Use the Vercel AI SDK’s core features in one place
	•	Build composable, typed UIs that react to structured model outputs
	•	Explore when Tools are enough vs. when Agents add value
	•	Experiment with toggling, auto-routing, and fallback strategies
	•	Observe full request flow via a Developer View that exposes both tools and agents

