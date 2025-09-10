/**
 * @fileoverview Individual message bubble component for chat interface
 * @description Displays user and assistant messages with proper styling and metadata
 */

'use client'

import { ChatMessage } from '@/types/chat'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { User, Bot, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  /** The message to display */
  message: ChatMessage
  /** Whether to show metadata like timing and tokens */
  showMetadata?: boolean
}

/**
 * Message bubble component for displaying individual chat messages
 * @description Renders messages with appropriate styling based on role and metadata
 * @param props - Component props including message data and display options
 * @returns JSX element containing the formatted message bubble
 */
export function MessageBubble({ message, showMetadata = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center mb-4">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn('flex mb-4 gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        </Avatar>
      )}

      <div className={cn('flex flex-col max-w-[80%]', isUser && 'items-end')}>
        <Card
          className={cn(
            'border-0 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground ml-12'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <CardContent className="p-3">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {/* Handle AI SDK v5 message structure with parts */}
              {message.parts ? (
                message.parts.map((part: any, index: number) => {
                  if (part.type === 'text') {
                    return <div key={index}>{part.text}</div>
                  }
                  // Handle tool calls (they're displayed separately in the right panel)
                  if (part.type?.startsWith('tool-')) {
                    return null // Don't display tool calls in the message bubble
                  }
                  return null
                })
              ) : (
                // Fallback for simple content (user messages)
                message.content
              )}
            </div>
          </CardContent>
        </Card>

        {showMetadata && message.metadata && (
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {message.metadata.processingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{message.metadata.processingTime}ms</span>
              </div>
            )}
            
            {message.metadata.tokens && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{message.metadata.tokens.total} tokens</span>
              </div>
            )}

            {message.metadata.model && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {message.metadata.model}
              </Badge>
            )}
          </div>
        )}

        {message.metadata?.tools && message.metadata.tools.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.metadata.tools.map((tool) => (
              <Card key={tool.id} className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{tool.name}</span>
                    {tool.executionTime && (
                      <span className="text-muted-foreground">{tool.executionTime}ms</span>
                    )}
                  </div>
                  {tool.error && (
                    <div className="text-red-600 dark:text-red-400 text-xs mt-1">
                      Error: {tool.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="w-8 h-8 shrink-0">
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </Avatar>
      )}
    </div>
  )
}
