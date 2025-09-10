/**
 * @fileoverview Display component for messages containing both text and images
 * @description Renders combined text, images, analysis, and citations in chat
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Eye, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { GeneratedImage, AnalyzedImage } from '@/types/images'
import { CitationSource } from '@/types/rag'

interface MixedContentCardProps {
  content: string
  images?: GeneratedImage[]
  analyzedImages?: AnalyzedImage[]
  citations?: CitationSource[]
}

export function MixedContentCard({ 
  content, 
  images, 
  analyzedImages, 
  citations 
}: MixedContentCardProps) {
  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {/* Text content */}
      {content && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
      
      {/* Generated images */}
      {images && images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-purple-800 dark:text-purple-200">
            <Eye className="w-4 h-4" />
            Generated Images
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="border-l-4 border-l-purple-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img 
                      src={image.url} 
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground italic mb-2 line-clamp-2">
                      "{image.revisedPrompt || image.prompt}"
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {image.provider}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {image.size}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadImage(image.url, `generated-${image.id}.png`)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Analyzed images */}
      {analyzedImages && analyzedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
            <Tag className="w-4 h-4" />
            Image Analysis Results
          </div>
          <div className="space-y-3">
            {analyzedImages.map((result, index) => (
              <Card key={result.id || index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={result.url} 
                        alt="Analyzed image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-2">{result.analysis.description}</p>
                      
                      {/* Objects found */}
                      {result.analysis.objects.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Objects:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.analysis.objects.slice(0, 5).map((object, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {object}
                              </Badge>
                            ))}
                            {result.analysis.objects.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{result.analysis.objects.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {result.analysis.tags.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Tags:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.analysis.tags.slice(0, 8).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.analysis.tags.length > 8 && (
                              <Badge variant="secondary" className="text-xs">
                                +{result.analysis.tags.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Confidence: {Math.round(result.analysis.confidence * 100)}%</span>
                        <span>Style: {result.analysis.style}</span>
                        <span>Mood: {result.analysis.mood}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Citations (from RAG) */}
      {citations && citations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-200">
            📚 Document Sources
          </div>
          {citations.map((citation, index) => (
            <Card key={index} className="border-l-4 border-l-green-500">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-sm text-green-900 dark:text-green-100">
                    {citation.source}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(citation.relevanceScore * 100)}% match
                  </Badge>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                  {citation.content.substring(0, 200)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
