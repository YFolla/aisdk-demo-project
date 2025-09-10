/**
 * @fileoverview Document upload interface with drag-and-drop support
 * @description Handles PDF uploads, URL processing, and text input for RAG
 */

'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Upload, Link, Type, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
  onUploadComplete?: (document: any) => void
  onUploadError?: (error: string) => void
}

interface UploadState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  progress: number
  message: string
  error?: string
}

export function DocumentUpload({ onUploadComplete, onUploadError }: DocumentUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    message: ''
  })
  const [url, setUrl] = useState('')
  const [textContent, setTextContent] = useState('')
  const [textTitle, setTextTitle] = useState('')

  const uploadDocument = async (formData: FormData) => {
    setUploadState({ status: 'uploading', progress: 20, message: 'Uploading document...' })

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const responseText = await response.text()
        
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          throw new Error(`HTTP ${response.status}: ${responseText.substring(0, 200)}...`)
        }
        
        throw new Error(errorData.error || errorData.message || 'Upload failed')
      }

      setUploadState({ status: 'processing', progress: 60, message: 'Processing and generating embeddings...' })

      const result = await response.json()

      setUploadState({ 
        status: 'success', 
        progress: 100, 
        message: result.message || 'Document uploaded successfully! You can now ask questions about it.' 
      })

      onUploadComplete?.(result.document)

      // Show success message longer and add visual confirmation
      setTimeout(() => {
        setUploadState({ status: 'idle', progress: 0, message: '' })
        setUrl('')
        setTextContent('')
        setTextTitle('')
      }, 5000) // Increased to 5 seconds

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadState({ 
        status: 'error', 
        progress: 0, 
        message: 'Upload failed', 
        error: errorMessage 
      })
      onUploadError?.(errorMessage)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('source', 'pdf')

    await uploadDocument(formData)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploadState.status === 'uploading' || uploadState.status === 'processing'
  })

  const handleUrlUpload = async () => {
    if (!url.trim()) return

    const formData = new FormData()
    formData.append('url', url.trim())
    formData.append('source', 'url')

    await uploadDocument(formData)
  }

  const handleTextUpload = async () => {
    if (!textContent.trim()) return

    const formData = new FormData()
    formData.append('content', textContent.trim())
    formData.append('title', textTitle.trim() || 'Untitled Document')
    formData.append('source', 'text')

    await uploadDocument(formData)
  }

  const isUploading = uploadState.status === 'uploading' || uploadState.status === 'processing'

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Add documents to your knowledge base for AI-powered search and retrieval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                isUploading && 'cursor-not-allowed opacity-50'
              )}
            >
              <input {...getInputProps()} />
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Drop the PDF here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Drag & drop a PDF file here</p>
                  <p className="text-sm text-muted-foreground">or click to select a file</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isUploading}
              />
            </div>
            <Button 
              onClick={handleUrlUpload} 
              disabled={!url.trim() || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process URL'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text-title">Document Title</Label>
              <Input
                id="text-title"
                placeholder="My Document"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                disabled={isUploading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                placeholder="Paste your text content here..."
                rows={8}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                disabled={isUploading}
              />
            </div>
            <Button 
              onClick={handleTextUpload} 
              disabled={!textContent.trim() || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Add Text Document'
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Upload Progress */}
        {uploadState.status !== 'idle' && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{uploadState.message}</span>
              {uploadState.status === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              {uploadState.status === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              {isUploading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
            <Progress value={uploadState.progress} className="w-full" />
            {uploadState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadState.error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
