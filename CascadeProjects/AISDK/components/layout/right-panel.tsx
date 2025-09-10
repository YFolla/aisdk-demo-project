/**
 * @fileoverview Right panel component for displaying tool results and structured outputs
 * @description Responsive panel that shows tool execution results and structured data
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PanelRight, X, Maximize2, Minimize2 } from 'lucide-react'
import { ToolResultCard } from '@/components/tools/tool-result-card'
import { WeatherResult } from '@/components/tools/weather-result'
import { CurrencyResult } from '@/components/tools/currency-result'
import { cn } from '@/lib/utils'

interface ToolExecution {
  id: string
  toolName: string
  result: any
  executedAt: Date
}

interface RightPanelProps {
  /** Array of tool executions to display */
  toolExecutions?: ToolExecution[]
  /** Whether the panel is collapsed */
  isCollapsed?: boolean
  /** Callback when panel collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void
}

/**
 * Right panel component for displaying tool results
 * @description Shows tool execution results in a responsive panel layout
 * @param props - Component props including tool executions and state
 * @returns JSX element containing the right panel
 */
export function RightPanel({ 
  toolExecutions = [], 
  isCollapsed = false, 
  onCollapseChange 
}: RightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  /**
   * Render tool result based on tool type
   * @param execution - Tool execution data
   * @returns Appropriate result component
   */
  const renderToolResult = (execution: ToolExecution) => {
    const { toolName, result } = execution

    if (!result.success) {
      return (
        <ToolResultCard
          key={execution.id}
          toolName={toolName}
          result={result}
        />
      )
    }

    switch (toolName) {
      case 'get_weather':
        return (
          <WeatherResult
            key={execution.id}
            data={result.data || result}
            executionTime={result.executionTime}
          />
        )
      case 'convert_currency':
        return (
          <CurrencyResult
            key={execution.id}
            data={result.data || result}
            executionTime={result.executionTime}
          />
        )
      default:
        return (
          <ToolResultCard
            key={execution.id}
            toolName={toolName}
            result={result}
          />
        )
    }
  }

  const panelContent = (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Tool Results</h3>
          {toolExecutions.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {toolExecutions.length}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Desktop controls */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCollapseChange?.(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <ScrollArea className="flex-1 p-4">
        {toolExecutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <PanelRight className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              No Tool Results
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Tool execution results will appear here when the AI uses tools to answer your questions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {toolExecutions.map(renderToolResult)}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Mobile: Bottom Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
              <PanelRight className="w-4 h-4 mr-2" />
              Results ({toolExecutions.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Tool Results</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full mt-4">
              <div className="space-y-4 pb-8">
                {toolExecutions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <PanelRight className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Tool results will appear here
                    </p>
                  </div>
                ) : (
                  toolExecutions.map(renderToolResult)
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Side Panel */}
      <aside 
        className={cn(
          'hidden md:flex flex-col border-l bg-background transition-all duration-200',
          isCollapsed ? 'w-0' : isExpanded ? 'w-96' : 'w-80'
        )}
      >
        {!isCollapsed && panelContent}
      </aside>
    </>
  )
}
