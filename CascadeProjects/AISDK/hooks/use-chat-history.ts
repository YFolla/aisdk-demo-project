/**
 * @fileoverview Hook for managing chat history and conversation persistence
 * @description Provides utilities for saving, loading, and managing chat conversations
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getConversationSummaries,
  getConversation,
  saveConversation,
  deleteConversation,
  clearAllConversations,
  exportConversations,
  importConversations,
  type ConversationSummary,
  type StoredConversation
} from '@/lib/storage/chat-storage'

export interface UseChatHistoryReturn {
  // Data
  conversations: ConversationSummary[]
  currentConversationId: string | null
  isLoading: boolean
  
  // Actions
  loadConversations: () => void
  loadConversation: (id: string) => StoredConversation | null
  saveCurrentConversation: (messages: any[], title?: string) => string
  deleteConversation: (id: string) => boolean
  clearAllConversations: () => boolean
  exportConversations: () => string
  importConversations: (jsonData: string) => boolean
  setCurrentConversationId: (id: string | null) => void
  
  // Utilities
  createNewConversation: () => void
}

/**
 * Hook for managing chat history and conversation persistence
 * @description Provides complete chat history management functionality
 * @returns Object with conversation data and management functions
 */
export function useChatHistory(): UseChatHistoryReturn {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Load all conversation summaries from storage
   * @description Refreshes the conversations list from localStorage
   */
  const loadConversations = useCallback(() => {
    try {
      setIsLoading(true)
      const summaries = getConversationSummaries()
      setConversations(summaries)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Load a specific conversation by ID
   * @description Retrieves full conversation data including messages
   * @param id - Conversation ID to load
   * @returns Stored conversation or null if not found
   */
  const loadConversation = useCallback((id: string): StoredConversation | null => {
    try {
      return getConversation(id)
    } catch (error) {
      console.error('Error loading conversation:', error)
      return null
    }
  }, [])

  /**
   * Save the current conversation
   * @description Saves messages to the current or new conversation
   * @param messages - Array of messages to save
   * @param title - Optional custom title
   * @returns Conversation ID
   */
  const saveCurrentConversation = useCallback((messages: any[], title?: string): string => {
    try {
      const id = saveConversation(currentConversationId, messages, title)
      setCurrentConversationId(id)
      loadConversations() // Refresh the list
      return id
    } catch (error) {
      console.error('Error saving conversation:', error)
      return currentConversationId || ''
    }
  }, [currentConversationId, loadConversations])

  /**
   * Delete a conversation
   * @description Removes conversation from storage and updates list
   * @param id - Conversation ID to delete
   * @returns Whether deletion was successful
   */
  const handleDeleteConversation = useCallback((id: string): boolean => {
    try {
      const success = deleteConversation(id)
      if (success) {
        loadConversations() // Refresh the list
        if (currentConversationId === id) {
          setCurrentConversationId(null)
        }
      }
      return success
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }, [currentConversationId, loadConversations])

  /**
   * Clear all conversations
   * @description Removes all stored conversations
   * @returns Whether clearing was successful
   */
  const handleClearAllConversations = useCallback((): boolean => {
    try {
      const success = clearAllConversations()
      if (success) {
        setConversations([])
        setCurrentConversationId(null)
      }
      return success
    } catch (error) {
      console.error('Error clearing conversations:', error)
      return false
    }
  }, [])

  /**
   * Export all conversations
   * @description Creates JSON export of all conversations
   * @returns JSON string of conversations
   */
  const handleExportConversations = useCallback((): string => {
    try {
      return exportConversations()
    } catch (error) {
      console.error('Error exporting conversations:', error)
      return '[]'
    }
  }, [])

  /**
   * Import conversations from JSON
   * @description Imports conversations and refreshes the list
   * @param jsonData - JSON string of conversations
   * @returns Whether import was successful
   */
  const handleImportConversations = useCallback((jsonData: string): boolean => {
    try {
      const success = importConversations(jsonData)
      if (success) {
        loadConversations() // Refresh the list
      }
      return success
    } catch (error) {
      console.error('Error importing conversations:', error)
      return false
    }
  }, [loadConversations])

  /**
   * Create a new conversation
   * @description Resets current conversation ID to start fresh
   */
  const createNewConversation = useCallback(() => {
    setCurrentConversationId(null)
  }, [])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  return {
    // Data
    conversations,
    currentConversationId,
    isLoading,
    
    // Actions
    loadConversations,
    loadConversation,
    saveCurrentConversation,
    deleteConversation: handleDeleteConversation,
    clearAllConversations: handleClearAllConversations,
    exportConversations: handleExportConversations,
    importConversations: handleImportConversations,
    setCurrentConversationId,
    
    // Utilities
    createNewConversation
  }
}
