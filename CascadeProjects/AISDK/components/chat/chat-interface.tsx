/**
 * @fileoverview Main chat interface component that combines message list and input
 * @description Orchestrates chat functionality with state management and AI integration
 */

'use client'

import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { useChatStore, useChatError, useDeveloperView } from '@/stores/chat-store'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ChatHistory } from './chat-history'
import { RightPanel } from '@/components/layout/right-panel'
import { DeveloperPanel } from '@/components/developer/developer-panel'
import { useChatHistory } from '@/hooks/use-chat-history'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * Main chat interface component combining all chat functionality
 * @description Provides complete chat experience with message display and input
 * @returns JSX element containing the full chat interface
 */
export function ChatInterface() {
  const showDeveloperView = useDeveloperView()
  const storeError = useChatError()
  const { setError, clearMessages } = useChatStore()
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [toolExecutions, setToolExecutions] = useState<any[]>([])
  const [aiRequests, setAiRequests] = useState<any[]>([])
  const [developerPanelCollapsed, setDeveloperPanelCollapsed] = useState(true)
  
  // Chat history management - temporarily disabled for debugging
  // const {
  //   currentConversationId,
  //   loadConversation,
  //   saveCurrentConversation,
  //   setCurrentConversationId
  // } = useChatHistory()

  // Use AI SDK v5's useChat hook for streaming functionality
  const {
    messages,
    sendMessage,
    isLoading,
    error: chatError,
    stop,
    setMessages,
  } = useChat({
    api: '/api/chat',
    // Remove the ID temporarily to see if that's causing the issue
    // id: currentConversationId || undefined,
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message)
    },
    onToolCall: async ({ toolCall }) => {
      console.log('Tool call:', toolCall)
      // Track tool call start for display in the right panel
      const execution = {
        id: toolCall.toolCallId,
        toolName: toolCall.toolName,
        result: { success: true, data: 'Processing...' },
        executedAt: new Date(),
      }
      setToolExecutions(prev => [...prev, execution])
    },
    onFinish: (message) => {
      console.log('🏁 Message finished:', message)
      console.log('🔍 Message structure:', {
        id: message.id,
        role: message.role,
        content: message.content,
        parts: message.parts,
        toolInvocations: message.toolInvocations?.length || 0
      })
      console.log('🗨️ Current messages array length:', messages?.length || 0)
      console.log('📋 All messages:', messages)
      
      // Update tool executions with actual results from toolInvocations
      if (message.toolInvocations && message.toolInvocations.length > 0) {
        message.toolInvocations.forEach((toolInvocation) => {
          if (toolInvocation.state === 'result') {
            setToolExecutions(prev => 
              prev.map(execution => 
                execution.id === toolInvocation.toolCallId 
                  ? {
                      ...execution,
                      result: {
                        success: true,
                        data: toolInvocation.result,
                        executionTime: Date.now() - execution.executedAt.getTime()
                      }
                    }
                  : execution
              )
            )
          }
        })
      }
      
      // Track AI request for developer panel
      const request = {
        id: Date.now().toString(),
        timestamp: new Date(),
        model: 'gpt-4o-mini',
        messages: messages,
        response: message.content,
        toolCalls: message.toolInvocations || [],
        latency: Date.now() - Date.now(), // Will be calculated properly in production
      }
      setAiRequests(prev => [...prev.slice(-9), request]) // Keep last 10 requests
    },
  })

  // Hydrate store on client side
  useEffect(() => {
    useChatStore.persist.rehydrate()
  }, [])

  // Debug useChat hook - reduced logging
  useEffect(() => {
    if (messages?.length > 0) {
      console.log('📨 Messages updated:', messages.length, 'messages')
    }
  }, [messages])

  // Sync chat error with store
  useEffect(() => {
    if (chatError) {
      setError(chatError.message)
    }
  }, [chatError, setError])

  /**
   * Handle sending a new message
   * @description Uses AI SDK v5's sendMessage functionality
   * @param content - The message content to send
   */
  const handleSendMessage = async (content: string) => {
    console.log('🚀 handleSendMessage called with:', content)
    console.log('🔍 Current state:', { 
      isLoading, 
      messagesCount: messages?.length || 0,
      sendMessageType: typeof sendMessage,
      chatError: chatError?.message,
      storeError: storeError?.message 
    })
    
    if (!content.trim() || isLoading) {
      console.log('❌ Message blocked:', { content: content.trim(), isLoading })
      return
    }

    // Clear any existing errors
    if (chatError || storeError) {
      console.log('🧹 Clearing existing errors')
      setError(null)
    }

    try {
      console.log('📤 About to call sendMessage...')
      
      // Direct API test removed for cleaner experience
      
      // Use AI SDK v5's sendMessage function
      console.log('🤖 Calling AI SDK sendMessage...')
      await sendMessage({
        role: 'user',
        content: content.trim(),
      })
      console.log('✅ Message sent successfully')
    } catch (error) {
      console.error('💥 Error sending message:', error)
      setError('Failed to send message. Please try again.')
    }
  }

  /**
   * Handle conversation selection from history
   * @param conversationId - ID of the conversation to load
   */
  const handleConversationSelect = (conversationId: string) => {
    // Disabled for debugging
    console.log('Conversation select disabled for debugging')
  }

  /**
   * Handle starting a new conversation
   */
  const handleNewConversation = () => {
    setMessages([])
    setToolExecutions([])
    setAiRequests([])
    setError(null)
    console.log('New conversation - messages cleared')
  }

  /**
   * Clear error state
   */
  const handleClearError = () => {
    setError(null)
  }

  /**
   * Clear all messages
   */
  const handleClearMessages = () => {
    clearMessages()
    // Also clear AI SDK messages by reloading without messages
    window.location.reload()
  }

  // Convert AI SDK messages to our message format
  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as 'user' | 'assistant' | 'system',
    timestamp: new Date(msg.createdAt || Date.now()),
    metadata: msg.role === 'assistant' ? {
      isStreaming: isLoading && msg.id === messages[messages.length - 1]?.id,
    } : undefined,
  }))

  // Auto-save conversations when messages change - temporarily disabled
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     const timeoutId = setTimeout(() => {
  //       saveCurrentConversation(messages)
  //     }, 1000) // Debounce saves by 1 second

  //     return () => clearTimeout(timeoutId)
  //   }
  // }, [messages, saveCurrentConversation])

  return (
    <div className="flex h-full">
      {/* Chat History Sidebar */}
      <ChatHistory
        currentConversationId={null}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        isCollapsed={leftPanelCollapsed}
        onCollapseChange={setLeftPanelCollapsed}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Error Display */}
        {(chatError || storeError) && (
          <Alert variant="destructive" className="m-4 mb-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{chatError?.message || storeError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearError}
                className="ml-2 h-6 text-xs"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Controls */}
        {showDeveloperView && (
          <div className="border-b bg-muted/30 p-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Developer View:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMessages}
                className="h-6 text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
              {isLoading && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stop}
                  className="h-6 text-xs"
                >
                  Stop
                </Button>
              )}
              <span className="text-muted-foreground">
                Messages: {messages.length} | Tools: {toolExecutions.length}
              </span>
            </div>
          </div>
        )}

        {/* Message List */}
        <MessageList
          messages={formattedMessages}
          showMetadata={showDeveloperView}
          isStreaming={isLoading}
        />

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Ask me anything... Try: 'What's the weather in London?' or 'Convert 100 USD to EUR'"
        />

        {/* Developer Panel */}
        {showDeveloperView && (
          <DeveloperPanel
            requests={aiRequests}
            config={{
              model: 'gpt-4-turbo-preview',
              temperature: 0.7,
              maxTokens: 1000,
              provider: 'OpenAI'
            }}
            isCollapsed={developerPanelCollapsed}
            onCollapseChange={setDeveloperPanelCollapsed}
          />
        )}
      </div>

      {/* Right Panel */}
      <RightPanel
        toolExecutions={toolExecutions}
        isCollapsed={rightPanelCollapsed}
        onCollapseChange={setRightPanelCollapsed}
      />
    </div>
  )
}