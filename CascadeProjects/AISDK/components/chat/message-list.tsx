/**
 * @fileoverview Scrollable message list component for chat interface
 * @description Displays list of messages with auto-scroll and streaming indicators
 */

'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/types/chat'
import { MessageBubble } from './message-bubble'

interface MessageListProps {
  /** Array of messages to display */
  messages: ChatMessage[]
  /** Whether to show message metadata */
  showMetadata?: boolean
  /** Whether AI is currently streaming a response */
  isStreaming?: boolean
}

/**
 * Scrollable list of chat messages with auto-scroll functionality
 * @description Renders messages in chronological order with streaming indicators
 * @param props - Component props including messages and display options
 * @returns JSX element containing the scrollable message list
 */
export function MessageList({ messages, showMetadata = false, isStreaming = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * Scroll to bottom when new messages arrive or streaming starts
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div className="max-w-md">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Welcome to AI Lab
          </h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation by typing a message below. You can ask questions,
            request tool usage, or explore AI capabilities.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            showMetadata={showMetadata}
          />
        ))}
        
        {isStreaming && (
          <div className="flex justify-start mb-4 gap-3">
            <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
              <span className="text-sm ml-2">AI is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
