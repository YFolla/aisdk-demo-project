/**
 * @fileoverview Chat history sidebar component
 * @description Displays list of saved conversations with management options
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  History, 
  MessageSquare, 
  Trash2, 
  Download, 
  Upload, 
  Plus,
  Settings,
  Calendar,
  Wrench
} from 'lucide-react'
import { useChatHistory } from '@/hooks/use-chat-history'
import { cn } from '@/lib/utils'

interface ChatHistoryProps {
  /** Current conversation ID */
  currentConversationId?: string | null
  /** Callback when a conversation is selected */
  onConversationSelect?: (conversationId: string) => void
  /** Callback when starting a new conversation */
  onNewConversation?: () => void
  /** Whether the sidebar is collapsed (desktop) */
  isCollapsed?: boolean
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * Chat history sidebar component
 * @description Shows conversation history with management options
 * @param props - Component props including callbacks and state
 * @returns JSX element containing the chat history interface
 */
export function ChatHistory({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  isCollapsed = false,
  onCollapseChange
}: ChatHistoryProps) {
  const {
    conversations,
    isLoading,
    deleteConversation,
    clearAllConversations,
    exportConversations,
    importConversations,
    createNewConversation
  } = useChatHistory()
  
  const [showSettings, setShowSettings] = useState(false)

  /**
   * Handle conversation selection
   * @param conversationId - ID of the selected conversation
   */
  const handleConversationSelect = (conversationId: string) => {
    onConversationSelect?.(conversationId)
  }

  /**
   * Handle new conversation creation
   */
  const handleNewConversation = () => {
    createNewConversation()
    onNewConversation?.()
  }

  /**
   * Handle conversation deletion
   * @param conversationId - ID of conversation to delete
   */
  const handleDeleteConversation = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    deleteConversation(conversationId)
  }

  /**
   * Handle export conversations
   */
  const handleExport = () => {
    const data = exportConversations()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Handle import conversations
   */
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const success = importConversations(content)
        if (success) {
          console.log('Conversations imported successfully')
        } else {
          console.error('Failed to import conversations')
        }
      } catch (error) {
        console.error('Error importing conversations:', error)
      }
    }
    reader.readAsText(file)
  }

  /**
   * Format date for display
   * @param date - Date to format
   * @returns Formatted date string
   */
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString()
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Chat History</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            className="h-8 w-8 p-0"
            title="New Conversation"
          >
            <Plus className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b bg-muted/30 p-3 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex-1 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
            
            <label className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                asChild
              >
                <span>
                  <Upload className="w-3 h-3 mr-1" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => clearAllConversations()}
            className="w-full text-xs"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
      )}

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-pulse">Loading conversations...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No conversations yet</p>
              <p className="text-xs">Start chatting to see history</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/50 p-2',
                  currentConversationId === conversation.id && 'bg-muted border-primary'
                )}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium line-clamp-2 flex-1">
                      {conversation.title}
                    </h4>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                      title="Delete conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(conversation.updatedAt)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs px-1">
                        {conversation.messageCount}
                      </Badge>
                      {conversation.hasTools && (
                        <Wrench className="w-3 h-3 text-blue-500" title="Uses tools" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Mobile: Bottom Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="fixed top-4 left-4 z-50">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Chat History</SheetTitle>
            </SheetHeader>
            <div className="h-full mt-4">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar */}
      <aside 
        className={cn(
          'hidden md:flex flex-col border-r bg-background transition-all duration-200',
          isCollapsed ? 'w-0' : 'w-80'
        )}
      >
        {!isCollapsed && sidebarContent}
      </aside>
    </>
  )
}
