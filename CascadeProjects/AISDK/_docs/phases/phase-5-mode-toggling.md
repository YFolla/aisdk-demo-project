# Phase 5: Manual Mode Toggling

**Goal**: Enable users to manually switch between Tools-only, Agents, and Auto modes, with performance comparison and transparency features. This phase provides control over execution strategy and insights into when different approaches work best.

**Duration**: 3-4 days

**Success Criteria**: 
- Users can manually select Tools, Agents, or Auto modes
- Mode selection persists across sessions
- Performance comparison shows cost/quality differences
- Developer View explains mode selection reasoning
- Mode switching works seamlessly during conversations

---

## Features & Tasks

### 1. **Mode Selection Interface**
**Objective**: Create intuitive UI controls for switching execution modes

**Steps**:
1. Build toggle component with three modes (Tools/Agents/Auto)
2. Add mode descriptions and capability explanations
3. Implement mode persistence in user preferences
4. Create mode-specific configuration options
5. Add visual indicators for current active mode

**Deliverables**:
- Mode toggle component with clear visual states
- Mode descriptions and help text
- Persistent mode selection across sessions
- Mode-specific configuration panels
- Current mode indicators throughout UI

### 2. **Mode Execution Logic**
**Objective**: Implement different execution paths based on selected mode

**Steps**:
1. Create mode-aware request routing in chat API
2. Implement Tools-only execution path (existing functionality)
3. Add Agents-only execution path (Phase 4 functionality)
4. Build Auto mode with intelligent routing logic
5. Add mode override capabilities for specific requests

**Deliverables**:
- Mode-aware API routing system
- Isolated execution paths for each mode
- Auto mode with intelligent request analysis
- Per-request mode override functionality
- Consistent error handling across all modes

### 3. **Performance Comparison System**
**Objective**: Track and compare performance metrics across different modes

**Steps**:
1. Build metrics collection for latency, cost, and quality
2. Create comparison dashboard showing mode performance
3. Implement A/B testing framework for same requests
4. Add user satisfaction tracking and feedback
5. Build performance history and trend analysis

**Deliverables**:
- Comprehensive metrics collection system
- Performance comparison dashboard
- A/B testing capabilities for mode comparison
- User feedback and satisfaction tracking
- Historical performance analysis and trends

### 4. **Enhanced Developer View**
**Objective**: Provide detailed insights into mode selection and execution

**Steps**:
1. Add mode selection reasoning display
2. Show execution path details for each mode
3. Implement cost breakdown by mode
4. Add performance predictions for different modes
5. Create mode recommendation system

**Deliverables**:
- Mode selection reasoning display
- Detailed execution path visualization
- Cost breakdown and analysis by mode
- Performance prediction system
- Intelligent mode recommendations

### 5. **Mode-Specific Optimizations**
**Objective**: Optimize each mode for its intended use case

**Steps**:
1. Optimize Tools mode for speed and cost efficiency
2. Enhance Agents mode for complex task quality
3. Tune Auto mode routing algorithms
4. Add mode-specific error handling strategies
5. Implement mode-aware caching and optimization

**Deliverables**:
- Speed-optimized Tools mode execution
- Quality-optimized Agents mode processing
- Intelligent Auto mode routing
- Mode-specific error handling and recovery
- Performance optimizations for each mode

---

## Key Components

### Mode Toggle Component
```typescript
// components/modes/mode-selector.tsx
export function ModeSelector() {
  const { currentMode, setMode } = useModeStore()
  
  return (
    <ToggleGroup type="single" value={currentMode} onValueChange={setMode}>
      <ToggleGroupItem value="tools">
        <Zap className="w-4 h-4 mr-2" />
        Tools
      </ToggleGroupItem>
      <ToggleGroupItem value="agents">
        <Brain className="w-4 h-4 mr-2" />
        Agents
      </ToggleGroupItem>
      <ToggleGroupItem value="auto">
        <Sparkles className="w-4 h-4 mr-2" />
        Auto
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
```

### Performance Comparison Dashboard
```typescript
// components/performance/mode-comparison.tsx
export function ModeComparison() {
  const { metrics } = usePerformanceMetrics()
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {['tools', 'agents', 'auto'].map(mode => (
        <Card key={mode}>
          <CardHeader>
            <CardTitle>{mode} Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Avg Latency: {metrics[mode].avgLatency}ms</div>
              <div>Avg Cost: ${metrics[mode].avgCost}</div>
              <div>Success Rate: {metrics[mode].successRate}%</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## Testing Phase 5

**Mode Selection Tests**:
- [ ] Mode toggle switches correctly between all three modes
- [ ] Mode selection persists across browser sessions
- [ ] Mode-specific configurations save and load properly
- [ ] Visual indicators correctly show current active mode
- [ ] Mode descriptions help users understand differences

**Execution Path Tests**:
- [ ] Tools mode executes without agent overhead
- [ ] Agents mode uses full orchestration system
- [ ] Auto mode intelligently routes based on request complexity
- [ ] Mode overrides work for specific requests
- [ ] Error handling works consistently across all modes

**Performance Comparison Tests**:
- [ ] Metrics collection captures accurate data for all modes
- [ ] Performance dashboard displays correct comparisons
- [ ] A/B testing produces reliable comparison results
- [ ] User feedback system works and stores responses
- [ ] Performance history shows accurate trends

**User Scenarios**:
1. **Mode Comparison**: Ask same question in all three modes, compare results
2. **Complex Task**: Use Agents mode for multi-step research task
3. **Quick Query**: Use Tools mode for simple weather/currency requests
4. **Auto Intelligence**: Let Auto mode choose for various request types
5. **Performance Analysis**: Review metrics to understand mode trade-offs

---

## Next Phase Preview

Phase 6 will add auto-routing and fallback strategies including:
- Intelligent request analysis for automatic mode selection
- Fallback mechanisms when agents exceed thresholds
- Transparency in routing decisions
- Metrics collection for router optimization
