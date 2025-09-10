/**
 * @fileoverview Chat input component with send functionality
 * @description Provides text input and send button for user messages
 */

'use client'

import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  /** Whether the chat is currently processing */
  isLoading?: boolean
  /** Callback fired when user sends a message */
  onSendMessage: (message: string) => void
  /** Placeholder text for the input */
  placeholder?: string
}

/**
 * Chat input component for composing and sending messages
 * @description Provides textarea input with send button and keyboard shortcuts
 * @param props - Component props including callbacks and state
 * @returns JSX element containing the chat input interface
 */
export function ChatInput({
  isLoading = false,
  onSendMessage,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  /**
   * Handle sending the message
   * @description Validates input and calls onSendMessage callback
   */
  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage)
      setMessage('')
    }
  }

  /**
   * Handle keyboard shortcuts in textarea
   * @description Supports Enter to send (with Shift+Enter for new line)
   * @param event - Keyboard event from textarea
   */
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="min-h-[60px] max-h-[200px] resize-none pr-12 text-foreground"
            rows={2}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          size="lg"
          className="shrink-0 h-[60px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
