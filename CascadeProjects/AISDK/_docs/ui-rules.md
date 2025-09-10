# UI Design Rules

Comprehensive design principles and component guidelines for the AI Lab application, emphasizing technical minimalism, responsiveness, and developer-focused transparency.

---

## Core Design Principles

### 1. **Technical Minimalism**
- **Clean Information Hierarchy**: Chat content is primary, tools/metadata are secondary
- **Generous Whitespace**: Use space to separate and organize complex information
- **Typography Scale**: Clear distinction between content types (chat, code, metadata)
- **Subtle Visual Elements**: Borders, shadows, and effects support rather than dominate

### 2. **Progressive Enhancement**
- **Core-First Design**: Chat interface works without advanced features
- **Layered Complexity**: Developer View, Agent Tree, and technical details are additive
- **Graceful Degradation**: Features degrade gracefully on smaller screens or slower connections
- **Optional Details**: Advanced information is accessible but never intrusive

### 3. **Real-Time Responsiveness**
- **Streaming Indicators**: Clear visual feedback for AI processing states
- **Immediate Feedback**: User actions have instant visual response
- **Progress Communication**: Long operations show clear progress indication
- **State Transparency**: Current mode and active providers are always visible

### 4. **Developer-Centric Transparency**
- **Inspectable Everything**: All AI operations can be examined in detail
- **Technical Precision**: Exact costs, tokens, latency displayed when requested
- **Debug-First Approach**: Technical details enhance understanding rather than clutter
- **Performance Visibility**: System performance metrics are accessible

---

## Responsive Design Strategy

### **Mobile-First Approach**
- Design for mobile (320px+) then enhance for larger screens
- Touch-friendly interface elements (44px minimum touch targets)
- Collapsible panels and progressive disclosure for small screens
- Swipe gestures for navigation between chat history and main interface

### **Breakpoint Strategy**
```css
/* Mobile: 320px - 767px */
.mobile-layout {
  /* Single column, stacked panels */
  /* Collapsible sidebar */
  /* Bottom sheet for developer view */
}

/* Tablet: 768px - 1023px */
.tablet-layout {
  /* Two column when space allows */
  /* Side panel for tools/citations */
  /* Expandable developer view */
}

/* Desktop: 1024px+ */
.desktop-layout {
  /* Three column layout */
  /* Persistent right panel */
  /* Inline developer view */
}

/* Large Desktop: 1440px+ */
.large-desktop-layout {
  /* Maximum content width with margins */
  /* Enhanced spacing and typography */
}
```

### **Adaptive Layouts**
- **Chat Interface**: Always full-width on mobile, constrained on desktop
- **Right Panel**: Bottom sheet on mobile, sidebar on tablet+
- **Developer View**: Modal on mobile, collapsible section on desktop
- **Navigation**: Bottom bar on mobile, header on desktop

---

## Component Design Patterns

### **Chat Interface Components**

#### Message Bubbles
```typescript
// User messages: Right-aligned, distinct styling
<div className="flex justify-end mb-4">
  <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2">
    {content}
  </div>
</div>

// AI messages: Left-aligned, with metadata
<div className="flex justify-start mb-4 space-x-3">
  <Avatar className="w-8 h-8 shrink-0" />
  <div className="flex-1 max-w-[80%]">
    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
      {content}
    </div>
    {metadata && <MessageMetadata {...metadata} />}
  </div>
</div>
```

#### Streaming Indicators
```typescript
// Typing animation for streaming responses
<div className="flex items-center space-x-1 text-muted-foreground">
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
  </div>
  <span className="text-sm">AI is thinking...</span>
</div>
```

### **Tool Result Cards**

#### Structured Output Display
```typescript
<Card className="border-l-4 border-l-blue-500 mb-4">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <ToolIcon className="w-4 h-4" />
        {toolName}
      </CardTitle>
      <Badge variant="secondary" className="text-xs">
        {executionTime}ms
      </Badge>
    </div>
  </CardHeader>
  <CardContent className="pt-0">
    <div className="prose prose-sm max-w-none">
      {formattedResult}
    </div>
  </CardContent>
</Card>
```

#### Citation Cards
```typescript
<Card className="border-l-4 border-l-amber-500 bg-amber-50/50 mb-4">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <FileText className="w-4 h-4" />
        {documentTitle}
      </CardTitle>
      <Button variant="ghost" size="sm" className="h-auto p-1">
        <ExternalLink className="w-3 h-3" />
      </Button>
    </div>
  </CardHeader>
  <CardContent className="pt-0">
    <blockquote className="text-sm italic border-l-2 border-amber-300 pl-3">
      {excerpt}
    </blockquote>
    <div className="text-xs text-muted-foreground mt-2">
      Page {pageNumber} • {confidence}% match
    </div>
  </CardContent>
</Card>
```

### **Navigation Components**

#### Mode Selector
```typescript
<ToggleGroup 
  type="single" 
  value={currentMode} 
  onValueChange={setMode}
  className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg"
>
  <ToggleGroupItem 
    value="tools" 
    className="data-[state=on]:bg-blue-500 data-[state=on]:text-white transition-all"
  >
    <Zap className="w-4 h-4 mr-2" />
    <span className="hidden sm:inline">Tools</span>
  </ToggleGroupItem>
  <ToggleGroupItem 
    value="agents" 
    className="data-[state=on]:bg-purple-500 data-[state=on]:text-white transition-all"
  >
    <Brain className="w-4 h-4 mr-2" />
    <span className="hidden sm:inline">Agents</span>
  </ToggleGroupItem>
  <ToggleGroupItem 
    value="auto" 
    className="data-[state=on]:bg-green-500 data-[state=on]:text-white transition-all"
  >
    <Sparkles className="w-4 h-4 mr-2" />
    <span className="hidden sm:inline">Auto</span>
  </ToggleGroupItem>
</ToggleGroup>
```

#### Provider Selector
```typescript
<Select value={currentProvider} onValueChange={setProvider}>
  <SelectTrigger className="w-full sm:w-[180px]">
    <SelectValue placeholder="Select provider" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="openai">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        OpenAI GPT-4
      </div>
    </SelectItem>
    <SelectItem value="anthropic">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        Claude 3.5 Sonnet
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

### **Developer View Components**

#### Collapsible Technical Details
```typescript
<Collapsible className="border rounded-lg">
  <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-2 text-sm font-medium">
      <Code className="w-4 h-4" />
      Developer View
    </div>
    <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
  </CollapsibleTrigger>
  <CollapsibleContent className="p-4 pt-0 border-t">
    <div className="space-y-4">
      <MetricsGrid metrics={performanceMetrics} />
      <RequestTrace trace={requestTrace} />
      <TokenUsage usage={tokenUsage} />
    </div>
  </CollapsibleContent>
</Collapsible>
```

#### Agent Tree Visualization
```typescript
<div className="font-mono text-xs bg-muted p-4 rounded-lg overflow-x-auto">
  <div className="whitespace-nowrap">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-3 h-3 bg-purple-500 rounded" />
      <span>Orchestrator</span>
      <Badge variant="outline">1.2s</Badge>
    </div>
    <div className="ml-4 border-l-2 border-muted-foreground/20 pl-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 bg-blue-500 rounded" />
        <span>RAG Agent</span>
        <Badge variant="outline">0.8s</Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded" />
        <span>Synthesizer</span>
        <Badge variant="outline">0.4s</Badge>
      </div>
    </div>
  </div>
</div>
```

---

## Layout Patterns

### **Primary Layout Structure**
```typescript
<div className="min-h-screen bg-background">
  {/* Header */}
  <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
    <div className="container flex h-14 items-center justify-between">
      <ModeSelector />
      <div className="flex items-center gap-2">
        <ProviderSelector />
        <DeveloperViewToggle />
      </div>
    </div>
  </header>

  {/* Main Content */}
  <div className="container flex-1 flex">
    {/* Chat History Sidebar - Hidden on mobile */}
    <aside className="hidden lg:flex w-64 border-r">
      <ChatHistory />
    </aside>

    {/* Chat Area */}
    <main className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ChatMessages />
      </div>
      <div className="border-t p-4">
        <ChatInput />
      </div>
    </main>

    {/* Right Panel - Responsive */}
    <aside className="hidden md:flex w-80 border-l flex-col">
      <ToolResults />
      <Citations />
      <ImageGallery />
    </aside>
  </div>
</div>
```

### **Mobile Layout Adaptations**
```typescript
// Mobile: Bottom sheet for right panel content
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="sm" className="md:hidden">
      <PanelRight className="w-4 h-4" />
      Results ({resultCount})
    </Button>
  </SheetTrigger>
  <SheetContent side="bottom" className="h-[80vh]">
    <div className="space-y-4">
      <ToolResults />
      <Citations />
      <ImageGallery />
    </div>
  </SheetContent>
</Sheet>

// Mobile: Drawer for chat history
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="ghost" size="sm" className="lg:hidden">
      <History className="w-4 h-4" />
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="p-4">
      <ChatHistory />
    </div>
  </DrawerContent>
</Drawer>
```

---

## Accessibility Guidelines

### **Keyboard Navigation**
- All interactive elements accessible via keyboard
- Logical tab order through chat interface
- Escape key closes modals and sheets
- Arrow keys navigate through message history

### **Screen Reader Support**
- Semantic HTML structure with proper headings
- ARIA labels for complex interactions
- Live regions for streaming content updates
- Alt text for generated images and charts

### **Visual Accessibility**
- Minimum 4.5:1 color contrast ratios
- Focus indicators visible on all interactive elements
- Text remains readable when zoomed to 200%
- No reliance on color alone for information

### **Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-bounce,
  .transition-all,
  .animate-pulse {
    animation: none;
    transition: none;
  }
}
```

---

## Performance Guidelines

### **Rendering Optimization**
- Virtualize long chat histories (react-window)
- Lazy load images and heavy components
- Memoize expensive calculations and renders
- Debounce user input for search and filtering

### **Bundle Size Management**
- Code split by route and feature
- Dynamic imports for heavy dependencies (PDF.js)
- Tree shake unused utilities and components
- Optimize images and assets

### **Memory Management**
- Clean up event listeners and subscriptions
- Dispose of PDF documents after processing
- Limit chat history in memory (paginate older messages)
- Clear unused embeddings and vector caches

---

## Error Handling Patterns

### **Graceful Degradation**
```typescript
// Error boundary for AI operations
<ErrorBoundary
  fallback={({ error, retry }) => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-destructive mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">AI Request Failed</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {error.message}
        </p>
        <Button variant="outline" size="sm" onClick={retry}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  )}
>
  <AIResponse />
</ErrorBoundary>
```

### **Loading States**
```typescript
// Skeleton loading for chat messages
<div className="space-y-4">
  {isLoading && (
    <div className="flex justify-start space-x-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )}
</div>
```

---

## Testing Guidelines

### **Component Testing**
- Test responsive behavior at different breakpoints
- Verify keyboard navigation and accessibility
- Test loading states and error conditions
- Mock AI streaming for consistent test results

### **Integration Testing**
- Test full user flows (upload → chat → results)
- Verify state persistence across sessions
- Test mode switching and provider changes
- Validate real-time updates and streaming

### **Performance Testing**
- Measure render times for large chat histories
- Test memory usage with multiple documents
- Verify smooth streaming at various network speeds
- Monitor bundle size impact of new features

These UI rules ensure consistent, accessible, and performant user experiences across all features and device types while maintaining the technical precision required for an AI development tool.
