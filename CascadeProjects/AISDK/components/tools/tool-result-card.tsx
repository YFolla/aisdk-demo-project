/**
 * @fileoverview Generic tool result card component
 * @description Displays tool execution results with consistent formatting
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { ToolResult } from '@/types/tools'
import { cn } from '@/lib/utils'

interface ToolResultCardProps {
  /** Name of the tool that was executed */
  toolName: string
  /** Result from tool execution */
  result: ToolResult
  /** Optional custom icon for the tool */
  icon?: React.ReactNode
  /** Whether to show detailed metadata */
  showDetails?: boolean
  /** Optional click handler for the card */
  onClick?: () => void
}

/**
 * Generic card component for displaying tool execution results
 * @description Provides consistent formatting for all tool results
 * @param props - Component props including tool result data
 * @returns JSX element containing the formatted tool result
 */
export function ToolResultCard({
  toolName,
  result,
  icon,
  showDetails = false,
  onClick,
}: ToolResultCardProps) {
  const isSuccess = result.success
  const borderColor = isSuccess ? 'border-l-green-500' : 'border-l-red-500'
  const bgColor = isSuccess ? 'bg-green-50/50 dark:bg-green-950/20' : 'bg-red-50/50 dark:bg-red-950/20'

  return (
    <Card className={cn('border-l-4 mb-4', borderColor, bgColor, onClick && 'cursor-pointer hover:shadow-md transition-shadow')} onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {icon || (isSuccess ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />)}
            <span className="capitalize">{toolName.replace(/_/g, ' ')}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {result.executionTime && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {result.executionTime}ms
              </Badge>
            )}
            {result.metadata?.source && (
              <Badge variant="outline" className="text-xs">
                {result.metadata.source}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isSuccess ? (
          <div className="space-y-2">
            {/* Success content will be handled by specific tool components */}
            {result.data && (
              <div className="text-sm">
                {typeof result.data === 'string' ? (
                  <p>{result.data}</p>
                ) : (
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
            
            {showDetails && result.metadata && (
              <div className="text-xs text-muted-foreground space-y-1">
                {result.metadata.timestamp && (
                  <div>Executed: {new Date(result.metadata.timestamp).toLocaleString()}</div>
                )}
                {Object.entries(result.metadata).map(([key, value]) => {
                  if (key === 'timestamp' || key === 'source') return null
                  return (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-red-600 dark:text-red-400">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Execution Failed</span>
            </div>
            <p className="text-xs">{result.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
