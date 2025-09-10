/**
 * @fileoverview Chat storage utilities for conversation persistence
 * @description Manages local storage of chat conversations and metadata
 */

export interface StoredConversation {
  id: string
  title: string
  messages: any[]
  createdAt: Date
  updatedAt: Date
  metadata?: {
    messageCount: number
    hasTools: boolean
    model?: string
  }
}

export interface ConversationSummary {
  id: string
  title: string
  messageCount: number
  createdAt: Date
  updatedAt: Date
  hasTools: boolean
}

const STORAGE_KEY = 'aisdk-conversations'
const MAX_CONVERSATIONS = 50

/**
 * Generate a conversation title from the first message
 * @description Creates a meaningful title from the user's first message
 * @param messages - Array of conversation messages
 * @returns Generated title string
 */
function generateTitle(messages: any[]): string {
  const firstUserMessage = messages.find(msg => msg.role === 'user')
  if (!firstUserMessage) return 'New Conversation'
  
  const content = firstUserMessage.content || ''
  // Truncate to 50 characters and add ellipsis if needed
  return content.length > 50 ? content.substring(0, 47) + '...' : content
}

/**
 * Get all conversation summaries from localStorage
 * @description Retrieves list of all stored conversations with metadata
 * @returns Array of conversation summaries
 */
export function getConversationSummaries(): ConversationSummary[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const conversations: StoredConversation[] = JSON.parse(stored)
    return conversations
      .map(conv => ({
        id: conv.id,
        title: conv.title,
        messageCount: conv.messages.length,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        hasTools: conv.metadata?.hasTools || false
      }))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  } catch (error) {
    console.error('Error loading conversation summaries:', error)
    return []
  }
}

/**
 * Get a specific conversation by ID
 * @description Retrieves full conversation data including messages
 * @param conversationId - ID of the conversation to retrieve
 * @returns Stored conversation or null if not found
 */
export function getConversation(conversationId: string): StoredConversation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const conversations: StoredConversation[] = JSON.parse(stored)
    const conversation = conversations.find(conv => conv.id === conversationId)
    
    if (conversation) {
      // Convert date strings back to Date objects
      conversation.createdAt = new Date(conversation.createdAt)
      conversation.updatedAt = new Date(conversation.updatedAt)
    }
    
    return conversation || null
  } catch (error) {
    console.error('Error loading conversation:', error)
    return null
  }
}

/**
 * Save or update a conversation
 * @description Stores conversation in localStorage with metadata
 * @param conversationId - ID of the conversation (generates new if not provided)
 * @param messages - Array of conversation messages
 * @param title - Optional custom title (auto-generated if not provided)
 * @returns The saved conversation ID
 */
export function saveConversation(
  conversationId: string | null,
  messages: any[],
  title?: string
): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const conversations: StoredConversation[] = stored ? JSON.parse(stored) : []
    
    const id = conversationId || generateId()
    const now = new Date()
    const hasTools = messages.some(msg => msg.toolInvocations && msg.toolInvocations.length > 0)
    
    const conversation: StoredConversation = {
      id,
      title: title || generateTitle(messages),
      messages,
      createdAt: conversationId ? 
        (conversations.find(c => c.id === conversationId)?.createdAt || now) : 
        now,
      updatedAt: now,
      metadata: {
        messageCount: messages.length,
        hasTools,
        model: 'gpt-4o-mini' // Could be made dynamic
      }
    }
    
    // Update existing or add new conversation
    const existingIndex = conversations.findIndex(conv => conv.id === id)
    if (existingIndex >= 0) {
      conversations[existingIndex] = conversation
    } else {
      conversations.push(conversation)
    }
    
    // Keep only the most recent conversations
    if (conversations.length > MAX_CONVERSATIONS) {
      conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      conversations.splice(MAX_CONVERSATIONS)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    return id
  } catch (error) {
    console.error('Error saving conversation:', error)
    return conversationId || generateId()
  }
}

/**
 * Delete a conversation
 * @description Removes conversation from localStorage
 * @param conversationId - ID of the conversation to delete
 * @returns Whether the deletion was successful
 */
export function deleteConversation(conversationId: string): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    
    const conversations: StoredConversation[] = JSON.parse(stored)
    const filteredConversations = conversations.filter(conv => conv.id !== conversationId)
    
    if (filteredConversations.length === conversations.length) {
      return false // Conversation not found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredConversations))
    return true
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return false
  }
}

/**
 * Clear all conversations
 * @description Removes all stored conversations from localStorage
 * @returns Whether the operation was successful
 */
export function clearAllConversations(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing conversations:', error)
    return false
  }
}

/**
 * Export conversations as JSON
 * @description Creates exportable JSON of all conversations
 * @returns JSON string of all conversations
 */
export function exportConversations(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored || '[]'
  } catch (error) {
    console.error('Error exporting conversations:', error)
    return '[]'
  }
}

/**
 * Import conversations from JSON
 * @description Imports conversations from JSON string (merges with existing)
 * @param jsonData - JSON string of conversations to import
 * @returns Whether the import was successful
 */
export function importConversations(jsonData: string): boolean {
  try {
    const importedConversations: StoredConversation[] = JSON.parse(jsonData)
    const stored = localStorage.getItem(STORAGE_KEY)
    const existingConversations: StoredConversation[] = stored ? JSON.parse(stored) : []
    
    // Merge conversations, avoiding duplicates by ID
    const mergedConversations = [...existingConversations]
    importedConversations.forEach(imported => {
      const existingIndex = mergedConversations.findIndex(existing => existing.id === imported.id)
      if (existingIndex >= 0) {
        mergedConversations[existingIndex] = imported
      } else {
        mergedConversations.push(imported)
      }
    })
    
    // Keep only the most recent conversations
    if (mergedConversations.length > MAX_CONVERSATIONS) {
      mergedConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      mergedConversations.splice(MAX_CONVERSATIONS)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedConversations))
    return true
  } catch (error) {
    console.error('Error importing conversations:', error)
    return false
  }
}

/**
 * Generate a unique ID for conversations
 * @description Creates a unique identifier using timestamp and random string
 * @returns Unique conversation ID
 */
function generateId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
