/**
 * @fileoverview Image upload API endpoint
 * @description Handles image uploads for analysis with GPT-4 Vision
 */

import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithGPT4Vision } from '@/lib/vision/gpt4-vision'
import { config } from '@/constants/config'

export async function POST(req: NextRequest) {
  try {
    console.log('📸 Image upload request received')
    
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const supportedFormats = config.images.storage.supportedFormats
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!fileExtension || !supportedFormats.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Unsupported file format. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validate file size
    if (file.size > config.images.storage.maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${config.images.storage.maxSize / 1024 / 1024}MB` },
        { status: 400 }
      )
    }
    
    console.log('📸 Processing image:', {
      filename: file.name,
      size: file.size,
      type: file.type
    })
    
    // Convert file to base64 data URL for GPT-4 Vision
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    // Analyze image with GPT-4 Vision
    const analysisResult = await analyzeImageWithGPT4Vision({
      imageUrl: dataUrl,
      detailLevel: 'high',
      includeText: true,
      generateTags: true
    })
    
    if (!analysisResult.success) {
      console.error('❌ Image analysis failed:', analysisResult.error)
      return NextResponse.json(
        { error: analysisResult.error || 'Image analysis failed' },
        { status: 500 }
      )
    }
    
    console.log('✅ Image analysis completed:', {
      objectsFound: analysisResult.analysis?.objects.length || 0,
      tagsGenerated: analysisResult.analysis?.tags.length || 0,
      confidence: analysisResult.analysis?.confidence || 0
    })
    
    const imageId = `uploaded-${Date.now()}`
    const response = {
      id: imageId,
      originalFilename: file.name,
      size: file.size,
      mimeType: file.type,
      analysis: analysisResult.analysis,
      uploadedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      image: response
    })
    
  } catch (error) {
    console.error('❌ Image upload error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to process image upload'
      },
      { status: 500 }
    )
  }
}
