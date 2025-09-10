/**
 * @fileoverview Citation display component for RAG responses
 * @description Shows source references and document citations with relevance scores
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Citation {
  id: string
  content: string
  source: string
  page?: number
  section?: string
  relevanceScore: number
  rank: number
}

interface CitationDisplayProps {
  citations: Citation[]
  query: string
  className?: string
}

export function CitationDisplay({ citations, query, className }: CitationDisplayProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set())

  const toggleCitation = (citationId: string) => {
    const newExpanded = new Set(expandedCitations)
    if (newExpanded.has(citationId)) {
      newExpanded.delete(citationId)
    } else {
      newExpanded.add(citationId)
    }
    setExpandedCitations(newExpanded)
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 0.8) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (score >= 0.7) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (citations.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No sources found for this query. Try uploading relevant documents first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Sources ({citations.length})
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Documents referenced for: "{query}"
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {citations.map((citation) => {
          const isExpanded = expandedCitations.has(citation.id)
          
          return (
            <Collapsible key={citation.id}>
              <div className="border rounded-lg p-3 space-y-2">
                {/* Citation Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        #{citation.rank}
                      </span>
                      <h4 className="font-medium text-sm truncate">
                        {citation.source}
                      </h4>
                      {citation.page && (
                        <Badge variant="outline" className="text-xs">
                          Page {citation.page}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={cn('text-xs', getRelevanceColor(citation.relevanceScore))}
                      >
                        {Math.round(citation.relevanceScore * 100)}% match
                      </Badge>
                      {citation.section && (
                        <span className="text-xs text-muted-foreground">
                          {citation.section}
                        </span>
                      )}
                    </div>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCitation(citation.id)}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                {/* Citation Preview */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {truncateContent(citation.content)}
                </p>

                {/* Expanded Content */}
                <CollapsibleContent>
                  <div className="pt-2 border-t">
                    <div className="bg-muted/50 rounded p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {citation.content}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )
        })}
      </CardContent>
    </Card>
  )
}
