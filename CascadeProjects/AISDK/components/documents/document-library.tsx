/**
 * @fileoverview Document library component for managing uploaded documents
 * @description Shows uploaded documents with search, filtering, and management features
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Search, 
  Trash2, 
  Calendar, 
  Hash, 
  Database,
  AlertCircle,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoredDocument {
  id: string
  title: string
  source: 'pdf' | 'url' | 'text'
  chunkCount: number
  createdAt: string
  status: 'completed' | 'processing' | 'error'
}

interface DocumentLibraryProps {
  onDocumentSelect?: (document: StoredDocument) => void
  onUploadClick?: () => void
  className?: string
}

export function DocumentLibrary({ 
  onDocumentSelect, 
  onUploadClick,
  className 
}: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState<'all' | 'pdf' | 'url' | 'text'>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Load documents from localStorage
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = () => {
    try {
      const stored = localStorage.getItem('aisdk-documents')
      if (stored) {
        const parsedDocs = JSON.parse(stored) as StoredDocument[]
        setDocuments(parsedDocs)
      }
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addDocument = (document: StoredDocument) => {
    const updatedDocs = [...documents, document]
    setDocuments(updatedDocs)
    localStorage.setItem('aisdk-documents', JSON.stringify(updatedDocs))
  }

  const removeDocument = (documentId: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== documentId)
    setDocuments(updatedDocs)
    localStorage.setItem('aisdk-documents', JSON.stringify(updatedDocs))
  }

  // Filter documents based on search and source
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === 'all' || doc.source === selectedSource
    return matchesSearch && matchesSource
  })

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'pdf': return <FileText className="h-4 w-4" />
      case 'url': return <span className="text-xs font-mono">URL</span>
      case 'text': return <span className="text-xs font-mono">TXT</span>
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'pdf': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'url': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'text': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalChunks = documents.reduce((sum, doc) => sum + doc.chunkCount, 0)

  // Expose addDocument function for parent components
  useEffect(() => {
    ;(window as any).addDocumentToLibrary = addDocument
    return () => {
      delete (window as any).addDocumentToLibrary
    }
  }, [documents])

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Document Library
            </CardTitle>
            <CardDescription>
              {documents.length} documents • {totalChunks} chunks indexed
            </CardDescription>
          </div>
          <Button onClick={onUploadClick} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs value={selectedSource} onValueChange={(value) => setSelectedSource(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedSource} className="mt-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                {documents.length === 0 ? (
                  <div>
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your first document to get started with AI-powered search
                    </p>
                    <Button onClick={onUploadClick}>
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No documents match your search criteria
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onDocumentSelect?.(document)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={cn('text-xs', getSourceColor(document.source))}
                          >
                            {getSourceIcon(document.source)}
                            {document.source.toUpperCase()}
                          </Badge>
                          {document.status === 'processing' && (
                            <Badge variant="outline" className="text-xs">
                              Processing...
                            </Badge>
                          )}
                          {document.status === 'error' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {document.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {document.chunkCount} chunks
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(document.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeDocument(document.id)
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Storage Info */}
        {documents.length > 0 && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Documents are stored locally in your browser and indexed in your Pinecone database.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
