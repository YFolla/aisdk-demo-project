/**
 * @fileoverview Simple chat interface following AI SDK v5 documentation patterns
 * @description Clean implementation without complex state management
 */

'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, PanelRight, Code, X, Upload, FileText, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { DocumentUpload } from '@/components/documents/document-upload'
import { DocumentLibrary } from '@/components/documents/document-library'
import { CitationDisplay } from '@/components/documents/citation-display'

/**
 * Simple chat interface following official AI SDK patterns
 * @description Based on the official documentation examples
 */
export function SimpleChat() {
  const [input, setInput] = useState('')
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [developerViewOpen, setDeveloperViewOpen] = useState(false)
  const [toolExecutions, setToolExecutions] = useState<any[]>([])
  const [aiRequests, setAiRequests] = useState<any[]>([])
  const [showDocumentUpload, setShowDocumentUpload] = useState(false)
  const [showDocumentLibrary, setShowDocumentLibrary] = useState(false)
  const [ragCitations, setRagCitations] = useState<any[]>([])
  const [uploadNotification, setUploadNotification] = useState<string | null>(null)
  
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('💥 Chat error:', error)
    },
    onToolCall: async ({ toolCall }) => {
      // Track tool call start
      const execution = {
        id: toolCall.toolCallId,
        toolName: toolCall.toolName,
        input: toolCall.args,
        startTime: Date.now(),
        status: 'running'
      }
      setToolExecutions(prev => [...prev, execution])
    },
    onFinish: (message) => {
      // Update tool executions with results
      if (message.toolInvocations) {
        message.toolInvocations.forEach((toolInvocation) => {
          if (toolInvocation.state === 'result') {
            setToolExecutions(prev => 
              prev.map(execution => 
                execution.id === toolInvocation.toolCallId 
                  ? {
                      ...execution,
                      output: toolInvocation.result,
                      endTime: Date.now(),
                      status: 'completed',
                      executionTime: Date.now() - execution.startTime
                    }
                  : execution
              )
            )
            
            // Extract RAG citations if this was a document retrieval
            if (toolInvocation.toolName === 'retrieve_docs' && toolInvocation.result?.results) {
              const citations = toolInvocation.result.results.map((result: any) => ({
                id: result.id,
                content: result.content,
                source: result.source,
                page: result.page,
                relevanceScore: result.relevanceScore,
                rank: result.rank
              }))
              setRagCitations(prev => [...prev, ...citations])
            }
          }
        })
      }
      
      // Track AI request for developer panel
      const request = {
        id: Date.now().toString(),
        timestamp: new Date(),
        model: 'gpt-4o-mini',
        messages: messages,
        response: message,
        toolCalls: message.toolInvocations || [],
        latency: Date.now() - Date.now() // Will be calculated properly in production
      }
      setAiRequests(prev => [...prev.slice(-9), request]) // Keep last 10 requests
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      try {
        await sendMessage({ text: input })
      } catch (error) {
        console.error('Error sending message:', error)
      }
      
      setInput('')
    }
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h2 className="text-xl font-semibold">AI Chat</h2>
            <p className="text-sm text-muted-foreground">Powered by GPT-4o Mini with tool calling</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentLibrary(!showDocumentLibrary)}
              className={`h-9 w-9 p-0 rounded-lg transition-colors ${
                showDocumentLibrary ? 'bg-primary/10 text-primary' : ''
              }`}
              title="Document Library"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              className={`h-9 w-9 p-0 rounded-lg transition-colors ${
                showDocumentUpload ? 'bg-primary/10 text-primary' : ''
              }`}
              title="Upload Documents"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeveloperViewOpen(!developerViewOpen)}
              className={`h-9 w-9 p-0 rounded-lg transition-colors ${
                developerViewOpen ? 'bg-primary/10 text-primary' : ''
              }`}
              title="Toggle Developer View"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`h-9 w-9 p-0 rounded-lg transition-colors ${
                rightPanelOpen ? 'bg-primary/10 text-primary' : ''
              }`}
              title="Toggle Tool Results Panel"
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <h3 className="text-lg font-medium mb-3">Welcome to AI Lab</h3>
              <p className="text-sm">Start a conversation by typing a message below.</p>
            </div>
          )}
          
          {messages.map(message => {
            const isUser = message.role === 'user'
            
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
                <div className={`max-w-[80%] ${isUser ? 'ml-12' : 'mr-12'}`}>
                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    isUser 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {message.parts?.map((part, index) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <div key={index} className="prose prose-sm max-w-none dark:prose-invert">
                              <p className="m-0 leading-relaxed">{part.text}</p>
                            </div>
                          )
                        
                        case 'tool-get_weather':
                          return (
                            <div key={index} className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-3">
                              <div className="flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200 mb-3">
                                🌤️ Weather Information
                              </div>
                              {part.output && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                                      {part.output.location}
                                    </span>
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                      {part.output.temperature}{part.output.units}
                                    </span>
                                  </div>
                                  
                                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                    {part.output.description}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 text-xs text-blue-600 dark:text-blue-400 mt-4">
                                    <div className="flex items-center gap-1">
                                      <span>💧</span>
                                      <span>Humidity: {part.output.humidity}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span>🌬️</span>
                                      <span>Wind: {part.output.windSpeed} {part.output.units?.includes('°F') ? 'mph' : 'm/s'}</span>
                                    </div>
                                    {part.output.feelsLike && (
                                      <div className="flex items-center gap-1">
                                        <span>🌡️</span>
                                        <span>Feels like: {part.output.feelsLike}{part.output.units}</span>
                                      </div>
                                    )}
                                    {part.output.visibility && (
                                      <div className="flex items-center gap-1">
                                        <span>👁️</span>
                                        <span>Visibility: {part.output.visibility} km</span>
                                      </div>
                                    )}
                                    {part.output.pressure && (
                                      <div className="flex items-center gap-1">
                                        <span>📊</span>
                                        <span>Pressure: {part.output.pressure} hPa</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        
                        case 'tool-convert_currency':
                          return (
                            <div key={index} className="bg-green-50 dark:bg-green-950 p-4 rounded-xl border border-green-200 dark:border-green-800 mt-3">
                              <div className="flex items-center gap-2 font-medium text-green-800 dark:text-green-200 mb-3">
                                💱 Currency Conversion
                              </div>
                              {part.output && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">
                                      {part.output.amount} {part.output.from}
                                    </span>
                                    <span className="text-xl text-green-700 dark:text-green-300">→</span>
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                      {part.output.convertedAmount} {part.output.to}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs text-green-600 dark:text-green-400 space-y-2 pt-2 border-t border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-1">
                                      <span>📊</span>
                                      <span>Exchange Rate: 1 {part.output.from} = {part.output.exchangeRate} {part.output.to}</span>
                                    </div>
                                    {part.output.lastUpdated && (
                                      <div className="flex items-center gap-1">
                                        <span>🕒</span>
                                        <span>Updated: {new Date(part.output.lastUpdated).toLocaleString()}</span>
                                      </div>
                                    )}
                                    {part.output.provider && (
                                      <div className="flex items-center gap-1">
                                        <span>🏦</span>
                                        <span>Source: {part.output.provider}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        
                        case 'tool-retrieve_docs':
                          return (
                            <div key={index} className="bg-purple-50 dark:bg-purple-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800 mt-3">
                              <div className="flex items-center gap-2 font-medium text-purple-800 dark:text-purple-200 mb-3">
                                📚 Document Search Results
                              </div>
                              {part.output && (
                                <div className="space-y-3">
                                  <div className="text-sm text-purple-700 dark:text-purple-300">
                                    <strong>Query:</strong> {part.output.query}
                                  </div>
                                  <div className="text-sm text-purple-700 dark:text-purple-300">
                                    <strong>Found:</strong> {part.output.totalResults} relevant document{part.output.totalResults !== 1 ? 's' : ''}
                                  </div>
                                  {part.output.results && part.output.results.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                        Top Sources
                                      </div>
                                      {part.output.results.slice(0, 3).map((result: any, idx: number) => (
                                        <div key={idx} className="bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                                          <div className="flex items-start justify-between gap-2 mb-2">
                                            <span className="font-medium text-sm text-purple-900 dark:text-purple-100">
                                              {result.source}
                                            </span>
                                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                              {Math.round(result.relevanceScore * 100)}% match
                                            </span>
                                          </div>
                                          <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                                            {result.content.substring(0, 150)}...
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )

                        case 'tool-generate_image':
                          console.log('🎨 Image generation tool output:', part.output)
                          return (
                            <div key={index} className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 p-4 rounded-xl border border-pink-200 dark:border-pink-800 mt-3">
                              <div className="flex items-center gap-2 font-medium text-pink-800 dark:text-pink-200 mb-3">
                                🎨 Generated Image
                              </div>
                              {part.output && part.output.success && (
                                <div className="space-y-3">
                                  <div className="aspect-square max-w-md mx-auto rounded-lg overflow-hidden">
                                    <img 
                                      src={part.output.imageUrl} 
                                      alt={part.output.prompt}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="text-sm text-pink-700 dark:text-pink-300">
                                    <strong>Prompt:</strong> {part.output.revisedPrompt || part.output.prompt}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">{part.output.provider}</Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {part.output.metadata?.size}
                                      </span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        const link = document.createElement('a')
                                        link.href = part.output.imageUrl
                                        link.download = `generated-${part.output.imageId}.png`
                                        link.click()
                                      }}
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {part.output && !part.output.success && (
                                <div className="text-red-600 dark:text-red-400">
                                  <strong>Error:</strong> {part.output.error}
                                </div>
                              )}
                              {!part.output && (
                                <div className="text-gray-600 dark:text-gray-400">
                                  <strong>Debug:</strong> No tool output received
                                </div>
                              )}
                              {part.output && !part.output.hasOwnProperty('success') && (
                                <div className="text-yellow-600 dark:text-yellow-400">
                                  <strong>Debug:</strong> Tool output: {JSON.stringify(part.output, null, 2)}
                                </div>
                              )}
                            </div>
                          )

                        case 'tool-describe_image':
                          return (
                            <div key={index} className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-3">
                              <div className="flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200 mb-3">
                                🔍 Image Analysis
                              </div>
                              {part.output && part.output.success && (
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                      <img 
                                        src={part.output.imageUrl} 
                                        alt="Analyzed image"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                                        {part.output.analysis.description}
                                      </p>
                                      <div className="text-xs text-blue-600 dark:text-blue-400">
                                        <strong>Confidence:</strong> {Math.round(part.output.analysis.confidence * 100)}%
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Objects */}
                                  {part.output.analysis.objects && part.output.analysis.objects.length > 0 && (
                                    <div>
                                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Objects:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {part.output.analysis.objects.slice(0, 5).map((object: string, idx: number) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {object}
                                          </Badge>
                                        ))}
                                        {part.output.analysis.objects.length > 5 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{part.output.analysis.objects.length - 5} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Tags */}
                                  {part.output.analysis.tags && part.output.analysis.tags.length > 0 && (
                                    <div>
                                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Tags:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {part.output.analysis.tags.slice(0, 6).map((tag: string, idx: number) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {part.output.analysis.tags.length > 6 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{part.output.analysis.tags.length - 6} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
                                    <span>Style: {part.output.analysis.style}</span>
                                    <span>Mood: {part.output.analysis.mood}</span>
                                  </div>
                                </div>
                              )}
                              {part.output && !part.output.success && (
                                <div className="text-red-600 dark:text-red-400">
                                  <strong>Error:</strong> {part.output.error}
                                </div>
                              )}
                            </div>
                          )
                        
                        default:
                          return null
                      }
                    }) || (
                      // Fallback for simple content
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="m-0 leading-relaxed">{message.content}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message metadata */}
                  <div className={`text-xs text-muted-foreground mt-2 ${isUser ? 'text-right' : 'text-left'}`}>
                    {isUser ? 'You' : 'AI Assistant'}
                  </div>
                </div>
              </div>
            )
          })}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="max-w-[80%] mr-12">
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="text-sm ml-2">AI is thinking...</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">AI Assistant</div>
              </div>
            </div>
          )}
        </div>

        {/* Developer View */}
        <Collapsible open={developerViewOpen} onOpenChange={setDeveloperViewOpen}>
          <CollapsibleContent>
            <div className="border-t bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Developer View</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeveloperViewOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium mb-2">Recent AI Requests ({aiRequests.length})</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {aiRequests.slice(-3).map((request) => (
                        <Card key={request.id} className="p-2">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span>Model: {request.model}</span>
                              <span>{request.timestamp.toLocaleTimeString()}</span>
                            </div>
                            <div>Messages: {request.messages.length}</div>
                            <div>Tool Calls: {request.toolCalls.length}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium mb-2">Tool Executions ({toolExecutions.length})</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {toolExecutions.slice(-3).map((execution) => (
                        <Card key={execution.id} className="p-2">
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{execution.toolName}</span>
                              <Badge variant={execution.status === 'completed' ? 'default' : 'secondary'}>
                                {execution.status}
                              </Badge>
                            </div>
                            {execution.executionTime && (
                              <div>Execution: {execution.executionTime}ms</div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Input Form */}
        <div className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Ask me anything... Try: 'What's the weather in London?' or 'Convert 100 USD to EUR'"
                  disabled={isLoading}
                  className="min-h-[60px] max-h-[200px] resize-none text-foreground border-2 focus:border-primary/50 transition-colors rounded-xl px-4 py-3"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="text-xs text-muted-foreground">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {input.length}/1000
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="lg"
                className="shrink-0 h-[60px] w-[60px] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      {rightPanelOpen && (
        <div className="w-96 border-l bg-background flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div>
              <h3 className="font-semibold">Tool Results</h3>
              <p className="text-xs text-muted-foreground">{toolExecutions.length} executions</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(false)}
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            {toolExecutions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <PanelRight className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h4 className="font-medium text-sm mb-2">No Tool Results Yet</h4>
                <p className="text-xs leading-relaxed max-w-xs mx-auto">
                  Tool execution results will appear here when the AI uses tools to answer your questions.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {toolExecutions.map((execution) => (
                  <Card key={execution.id} className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{execution.toolName}</CardTitle>
                        <Badge 
                          variant={execution.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {execution.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {execution.input && (
                        <div>
                          <div className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                            Input Parameters
                          </div>
                          <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto border">
                            {JSON.stringify(execution.input, null, 2)}
                          </pre>
                        </div>
                      )}
                      {execution.output && (
                        <div>
                          <div className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                            Output Data
                          </div>
                          <pre className="text-xs bg-muted/50 p-3 rounded-lg overflow-x-auto border">
                            {JSON.stringify(execution.output, null, 2)}
                          </pre>
                        </div>
                      )}
                      {execution.executionTime && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-muted-foreground">Execution time</span>
                          <Badge variant="outline" className="text-xs">
                            {execution.executionTime}ms
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Document Upload Overlay */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentUpload(false)}
              className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-background border shadow-md z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <DocumentUpload
              onUploadComplete={(document) => {
                // Add to library via global function
                if ((window as any).addDocumentToLibrary) {
                  (window as any).addDocumentToLibrary(document)
                }
                setShowDocumentUpload(false)
                setUploadNotification(`✅ "${document.title}" uploaded successfully! You can now ask questions about it.`)
                setTimeout(() => setUploadNotification(null), 8000)
              }}
              onUploadError={(error) => {
                console.error('Document upload error:', error)
                setUploadNotification(`❌ Upload failed: ${error}`)
                setTimeout(() => setUploadNotification(null), 8000)
              }}
            />
          </div>
        </div>
      )}

      {/* Document Library Overlay */}
      {showDocumentLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDocumentLibrary(false)}
              className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-background border shadow-md z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            <DocumentLibrary
              onUploadClick={() => {
                setShowDocumentLibrary(false)
                setShowDocumentUpload(true)
              }}
              onDocumentSelect={(document) => {
                console.log('Selected document:', document)
                setShowDocumentLibrary(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Upload Notification */}
      {uploadNotification && (
        <div className="fixed top-4 right-4 max-w-sm z-50">
          <div className="bg-background border border-border rounded-lg p-4 shadow-lg">
            <p className="text-sm">{uploadNotification}</p>
          </div>
        </div>
      )}

      {/* RAG Citations Overlay */}
      {ragCitations.length > 0 && (
        <div className="fixed bottom-4 left-4 max-w-md z-40">
          <CitationDisplay
            citations={ragCitations}
            query={messages[messages.length - 1]?.content || ''}
          />
        </div>
      )}
    </div>
  )
}
