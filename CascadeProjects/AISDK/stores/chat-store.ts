/**
 * @fileoverview Zustand store for chat state management
 * @description Manages chat messages, AI modes, and conversation state with persistence
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ChatState, ChatActions, ChatMessage, AIMode, AIProvider } from '@/types/chat'

/**
 * Combined chat store interface with state and actions
 * @description Complete interface for chat state management
 */
export interface ChatStore extends ChatState, ChatActions {}

/**
 * Generate unique ID for messages
 * @description Creates timestamp-based unique identifiers
 * @returns Unique string identifier
 */
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Chat store with Zustand for state management
 * @description Centralized store for chat messages, AI configuration, and UI state
 */
export const useChatStore = create<ChatStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      messages: [],
      currentMode: 'tools' as AIMode,
      currentProvider: 'openai' as AIProvider,
      isLoading: false,
      error: null,
      showDeveloperView: false,

      // Actions
      addMessage: (messageData) => {
        set((state) => {
          const newMessage: ChatMessage = {
            ...messageData,
            id: generateId(),
            timestamp: new Date(),
          }
          state.messages.push(newMessage)
        })
      },

      updateMessage: (id, updates) => {
        set((state) => {
          const messageIndex = state.messages.findIndex((msg) => msg.id === id)
          if (messageIndex !== -1) {
            state.messages[messageIndex] = {
              ...state.messages[messageIndex],
              ...updates,
            }
          }
        })
      },

      removeMessage: (id) => {
        set((state) => {
          state.messages = state.messages.filter((msg) => msg.id !== id)
        })
      },

      clearMessages: () => {
        set((state) => {
          state.messages = []
          state.error = null
        })
      },

      setMode: (mode) => {
        set((state) => {
          state.currentMode = mode
        })
      },

      setProvider: (provider) => {
        set((state) => {
          state.currentProvider = provider
        })
      },

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading
          if (loading) {
            state.error = null
          }
        })
      },

      setError: (error) => {
        set((state) => {
          state.error = error
          if (error) {
            state.isLoading = false
          }
        })
      },

      toggleDeveloperView: () => {
        set((state) => {
          state.showDeveloperView = !state.showDeveloperView
        })
      },
    })),
    {
      name: 'aisdk-chat-store',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        messages: state.messages,
        currentMode: state.currentMode,
        currentProvider: state.currentProvider,
        showDeveloperView: state.showDeveloperView,
      }),
      // Skip hydration during SSR
      skipHydration: true,
    }
  )
)

/**
 * Selector hook for getting only messages
 * @description Optimized selector to prevent unnecessary re-renders
 * @returns Array of chat messages
 */
export const useChatMessages = () => useChatStore((state) => state.messages)

/**
 * Selector hook for getting current AI configuration
 * @description Gets current mode and provider settings
 * @returns Object with current mode and provider
 */
export const useChatConfig = () =>
  useChatStore((state) => ({
    mode: state.currentMode,
    provider: state.currentProvider,
  }))

/**
 * Selector hooks for individual UI state pieces to prevent unnecessary re-renders
 * @description Separate selectors for each UI state property
 */
export const useChatLoading = () => useChatStore((state) => state.isLoading)
export const useChatError = () => useChatStore((state) => state.error)
export const useDeveloperView = () => useChatStore((state) => state.showDeveloperView)

/**
 * Combined UI state selector with stable reference
 * @description Gets loading, error, and developer view state with memoization
 * @returns Object with UI state flags
 */
export const useChatUI = () => {
  const isLoading = useChatLoading()
  const error = useChatError()
  const showDeveloperView = useDeveloperView()
  
  return { isLoading, error, showDeveloperView }
}
