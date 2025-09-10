/**
 * @fileoverview Developer panel component for debugging AI operations
 * @description Provides detailed insights into AI requests, tool calls, and performance metrics
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Zap, 
  AlertCircle, 
  CheckCircle,
  Code,
  Activity,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AIRequest {
  id: string
  timestamp: Date
  model: string
  messages: any[]
  response?: string
  toolCalls?: any[]
  tokenUsage?: {
    prompt: number
    completion: number
    total: number
  }
  latency?: number
  error?: string
}

interface DeveloperPanelProps {
  /** Array of AI requests to display */
  requests?: AIRequest[]
  /** Current AI configuration */
  config?: {
    model: string
    temperature: number
    maxTokens: number
    provider: string
  }
  /** Whether the panel is collapsed */
  isCollapsed?: boolean
  /** Callback when panel collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * Developer panel component for AI operation debugging
 * @description Shows detailed information about AI requests, responses, and performance
 * @param props - Component props including requests and configuration
 * @returns JSX element containing the developer panel
 */
export function DeveloperPanel({ 
  requests = [], 
  config,
  isCollapsed = false,
  onCollapseChange
}: DeveloperPanelProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)

  /**
   * Format token usage for display
   * @param usage - Token usage information
   * @returns Formatted token usage string
   */
  const formatTokenUsage = (usage: AIRequest['tokenUsage']) => {
    if (!usage) return 'N/A'
    return `${usage.prompt} + ${usage.completion} = ${usage.total} tokens`
  }

  /**
   * Calculate estimated cost based on token usage
   * @param usage - Token usage information
   * @param model - AI model name
   * @returns Estimated cost in USD
   */
  const calculateCost = (usage: AIRequest['tokenUsage'], model: string) => {
    if (!usage) return 0
    
    // Rough pricing for GPT-4 (adjust based on actual model)
    const promptCost = usage.prompt * 0.00003 // $0.03 per 1K tokens
    const completionCost = usage.completion * 0.00006 // $0.06 per 1K tokens
    return (promptCost + completionCost).toFixed(4)
  }

  /**
   * Get status color based on request success/failure
   * @param request - AI request data
   * @returns CSS color class
   */
  const getStatusColor = (request: AIRequest) => {
    if (request.error) return 'text-red-600 dark:text-red-400'
    if (request.response) return 'text-green-600 dark:text-green-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  /**
   * Get status icon based on request success/failure
   * @param request - AI request data
   * @returns React icon component
   */
  const getStatusIcon = (request: AIRequest) => {
    if (request.error) return <AlertCircle className="w-4 h-4" />
    if (request.response) return <CheckCircle className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  if (isCollapsed) {
    return null
  }

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Code className="w-4 h-4" />
            Developer Panel
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapseChange?.(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Configuration Info */}
        {config && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Model</div>
              <div className="text-sm font-mono">{config.model}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Provider</div>
              <div className="text-sm">{config.provider}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Temperature</div>
              <div className="text-sm font-mono">{config.temperature}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Max Tokens</div>
              <div className="text-sm font-mono">{config.maxTokens}</div>
            </div>
          </div>
        )}

        {/* Request History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Request History</span>
            <Badge variant="secondary" className="text-xs">
              {requests.length}
            </Badge>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No requests yet</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {requests.slice(-10).reverse().map((request) => (
                  <Collapsible key={request.id}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                        onClick={() => setExpandedRequest(
                          expandedRequest === request.id ? null : request.id
                        )}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <div className={cn('flex items-center gap-1', getStatusColor(request))}>
                            {getStatusIcon(request)}
                            <span className="text-xs font-mono">
                              {request.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {request.latency && (
                            <Badge variant="outline" className="text-xs">
                              {request.latency}ms
                            </Badge>
                          )}
                          {request.toolCalls && request.toolCalls.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {request.toolCalls.length} tools
                            </Badge>
                          )}
                        </div>
                        {expandedRequest === request.id ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="px-2 pb-2">
                      <div className="space-y-3 text-xs">
                        {/* Request Details */}
                        <div className="grid grid-cols-2 gap-2 p-2 bg-muted/30 rounded">
                          <div>
                            <span className="font-medium">Model:</span> {request.model}
                          </div>
                          <div>
                            <span className="font-medium">Messages:</span> {request.messages.length}
                          </div>
                          {request.tokenUsage && (
                            <>
                              <div className="col-span-2">
                                <span className="font-medium">Tokens:</span> {formatTokenUsage(request.tokenUsage)}
                              </div>
                              <div>
                                <span className="font-medium">Est. Cost:</span> ${calculateCost(request.tokenUsage, request.model)}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Tool Calls */}
                        {request.toolCalls && request.toolCalls.length > 0 && (
                          <div>
                            <div className="font-medium mb-1">Tool Calls:</div>
                            <div className="space-y-1">
                              {request.toolCalls.map((tool, index) => (
                                <div key={index} className="p-2 bg-blue-50/50 dark:bg-blue-950/20 rounded text-xs">
                                  <div className="font-medium flex items-center gap-2">
                                    <Zap className="w-3 h-3" />
                                    {tool.name}
                                  </div>
                                  <pre className="mt-1 text-xs overflow-x-auto">
                                    {JSON.stringify(tool.parameters, null, 2)}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Error Details */}
                        {request.error && (
                          <div className="p-2 bg-red-50/50 dark:bg-red-950/20 rounded">
                            <div className="font-medium text-red-600 dark:text-red-400 mb-1">
                              Error:
                            </div>
                            <div className="text-red-700 dark:text-red-300">
                              {request.error}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
