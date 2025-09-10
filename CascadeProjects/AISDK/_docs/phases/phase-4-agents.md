# Phase 4: Agents and Subagents

**Goal**: Introduce a sophisticated agent orchestration system with specialized subagents that can decompose complex tasks, work in parallel, and synthesize results. This phase transforms the AI Lab from a tool-based system to an intelligent agent-based system capable of complex multi-step reasoning.

**Duration**: 5-6 days

**Success Criteria**: 
- Agent orchestrator can spawn and coordinate specialized subagents
- Agent tree visualization shows delegation hierarchy in Developer View
- Agents can retry, iterate, and refine their outputs internally
- Complex tasks are decomposed automatically into subtasks
- Agent system provides higher quality results than simple tool calling

---

## Features & Tasks

### 1. **Agent Registry and Architecture**
**Objective**: Create the foundational agent system with specialized subagents

**Steps**:
1. Design agent interface with input/output schemas and capabilities
2. Create agent registry for discovering and instantiating agents
3. Implement base agent class with common functionality (logging, error handling)
4. Build agent lifecycle management (spawn, execute, terminate)
5. Add agent capability discovery and matching system

**Deliverables**:
- Agent interface specification with TypeScript types
- Agent registry with capability-based discovery
- Base agent implementation with common functionality
- Agent lifecycle management system
- Agent capability matching and selection logic

### 2. **Specialized Subagents**
**Objective**: Implement four core specialized agents for different task types

**Steps**:
1. **Planner Agent**: Breaks down complex requests into actionable subtasks
2. **RAGer Agent**: Specializes in document retrieval and knowledge synthesis
3. **VisionTagger Agent**: Handles image analysis and multimodal content
4. **Synthesizer Agent**: Combines outputs from multiple agents into cohesive responses
5. Add agent-specific tools and capabilities for each specialization

**Deliverables**:
- Planner agent with task decomposition capabilities
- RAGer agent with enhanced document search and synthesis
- VisionTagger agent with advanced image processing
- Synthesizer agent with multi-source content integration
- Specialized tool sets for each agent type

### 3. **Agent Orchestrator**
**Objective**: Create the main orchestration system that coordinates subagents

**Steps**:
1. Build orchestrator that analyzes requests and selects appropriate agents
2. Implement parallel agent execution with dependency management
3. Create agent communication protocol for sharing context
4. Add result aggregation and synthesis logic
5. Implement agent retry and error recovery mechanisms

**Deliverables**:
- Central orchestrator with intelligent agent selection
- Parallel execution engine with dependency resolution
- Inter-agent communication system
- Result aggregation and synthesis pipeline
- Comprehensive error recovery and retry logic

### 4. **Agent Tree Visualization**
**Objective**: Provide detailed visualization of agent operations in Developer View

**Steps**:
1. Create agent tree component showing delegation hierarchy
2. Add real-time status updates for active agents
3. Implement execution timeline with parallel operation display
4. Build agent interaction logs and communication traces
5. Add performance metrics and cost tracking per agent

**Deliverables**:
- Interactive agent tree visualization
- Real-time agent status and progress indicators
- Execution timeline with parallel operation tracking
- Detailed agent interaction logs
- Per-agent performance and cost metrics

### 5. **Agent Mode Integration**
**Objective**: Seamlessly integrate agent system with existing chat interface

**Steps**:
1. Enhance chat interface to display agent operations
2. Create agent result cards with delegation information
3. Add agent progress indicators during complex operations
4. Implement agent cancellation and interruption capabilities
5. Build agent result comparison and analysis features

**Deliverables**:
- Chat interface enhanced for agent operations
- Agent-specific result display components
- Progress tracking for long-running agent tasks
- Agent operation cancellation capabilities
- Agent result comparison and analysis tools

---

## Enhanced Project Structure

```
/
├── app/
│   ├── api/
│   │   ├── agents/
│   │   │   ├── orchestrator/
│   │   │   │   └── route.ts      # Main orchestration endpoint
│   │   │   ├── planner/
│   │   │   │   └── route.ts      # Task planning agent
│   │   │   ├── rager/
│   │   │   │   └── route.ts      # RAG specialist agent
│   │   │   ├── vision-tagger/
│   │   │   │   └── route.ts      # Vision analysis agent
│   │   │   └── synthesizer/
│   │   │       └── route.ts      # Result synthesis agent
│   │   └── chat/
│   │       └── route.ts          # Enhanced with agent mode
├── components/
│   ├── agents/
│   │   ├── agent-tree.tsx        # Hierarchical agent visualization
│   │   ├── agent-status.tsx      # Individual agent status display
│   │   ├── agent-timeline.tsx    # Execution timeline view
│   │   ├── agent-logs.tsx        # Agent interaction logs
│   │   ├── agent-metrics.tsx     # Performance and cost tracking
│   │   └── agent-result-card.tsx # Agent-specific result display
│   ├── orchestration/
│   │   ├── orchestrator-panel.tsx # Main orchestration control
│   │   ├── task-decomposition.tsx # Task breakdown display
│   │   ├── agent-selection.tsx   # Agent capability matching
│   │   └── result-synthesis.tsx  # Combined result display
│   ├── developer/
│   │   └── agent-debug-view.tsx  # Enhanced developer view
│   └── chat/
│       └── agent-enhanced-bubble.tsx # Messages with agent info
├── lib/
│   ├── agents/
│   │   ├── core/
│   │   │   ├── agent-interface.ts # Base agent specification
│   │   │   ├── agent-registry.ts  # Agent discovery and management
│   │   │   ├── base-agent.ts      # Common agent functionality
│   │   │   └── agent-lifecycle.ts # Spawn, execute, terminate logic
│   │   ├── specialized/
│   │   │   ├── planner-agent.ts   # Task decomposition specialist
│   │   │   ├── rager-agent.ts     # Document retrieval specialist
│   │   │   ├── vision-tagger-agent.ts # Image analysis specialist
│   │   │   └── synthesizer-agent.ts # Result combination specialist
│   │   ├── orchestration/
│   │   │   ├── orchestrator.ts    # Main coordination logic
│   │   │   ├── task-analyzer.ts   # Request analysis and routing
│   │   │   ├── execution-engine.ts # Parallel agent execution
│   │   │   └── result-aggregator.ts # Output synthesis
│   │   └── communication/
│   │       ├── agent-protocol.ts  # Inter-agent communication
│   │       ├── context-sharing.ts # Shared context management
│   │       └── message-passing.ts # Agent message system
│   ├── tools/
│   │   └── agent-tools/
│   │       ├── planning-tools.ts  # Tools for Planner agent
│   │       ├── rag-tools.ts       # Enhanced RAG tools
│   │       ├── vision-tools.ts    # Enhanced vision tools
│   │       └── synthesis-tools.ts # Content combination tools
│   └── monitoring/
│       ├── agent-telemetry.ts     # Agent performance tracking
│       ├── execution-logging.ts   # Detailed operation logs
│       └── cost-tracking.ts       # Per-agent cost analysis
├── stores/
│   ├── agent-store.ts             # Agent execution state
│   ├── orchestration-store.ts     # Orchestrator state management
│   └── agent-debug-store.ts       # Debug and monitoring state
├── types/
│   ├── agents.ts                  # Agent interfaces and types
│   ├── orchestration.ts           # Orchestration types
│   └── agent-communication.ts     # Inter-agent message types
└── hooks/
    ├── use-agent-orchestration.ts # Agent coordination hooks
    ├── use-agent-monitoring.ts    # Agent status and metrics
    └── use-agent-debugging.ts     # Debug information hooks
```

---

## New Environment Variables

```bash
# Existing variables...
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Agent Configuration
AGENT_ORCHESTRATOR_MODEL=gpt-4-turbo-preview
AGENT_MAX_PARALLEL_EXECUTION=3
AGENT_TIMEOUT_SECONDS=300
AGENT_RETRY_ATTEMPTS=2
AGENT_COST_LIMIT_PER_REQUEST=5.00

# Specialized Agent Models
PLANNER_AGENT_MODEL=gpt-4-turbo-preview
RAGER_AGENT_MODEL=gpt-4-turbo-preview
VISION_TAGGER_MODEL=gpt-4-vision-preview
SYNTHESIZER_MODEL=gpt-4-turbo-preview

# Agent Monitoring
AGENT_LOGGING_LEVEL=info
AGENT_TELEMETRY_ENABLED=true
AGENT_PERFORMANCE_TRACKING=true
```

---

## Key Components Implementation

### Base Agent Interface
```typescript
// lib/agents/core/agent-interface.ts
/**
 * @fileoverview Core agent interface and type definitions
 */

export interface Agent {
  id: string
  name: string
  capabilities: AgentCapability[]
  version: string
  
  // Core methods
  execute(task: AgentTask, context: AgentContext): Promise<AgentResult>
  canHandle(task: AgentTask): Promise<boolean>
  estimateCost(task: AgentTask): Promise<number>
  
  // Lifecycle methods
  initialize(): Promise<void>
  cleanup(): Promise<void>
  
  // Monitoring
  getStatus(): AgentStatus
  getMetrics(): AgentMetrics
}

export interface AgentTask {
  id: string
  type: TaskType
  description: string
  input: unknown
  requirements: TaskRequirement[]
  priority: number
  deadline?: Date
  dependencies?: string[]
}

export interface AgentResult {
  success: boolean
  output?: unknown
  error?: string
  metadata: {
    executionTime: number
    tokensUsed: number
    cost: number
    confidence: number
    agentId: string
    timestamp: Date
  }
}
```

### Orchestrator Implementation
```typescript
// lib/agents/orchestration/orchestrator.ts
/**
 * @fileoverview Main agent orchestrator for task coordination
 */

export class AgentOrchestrator {
  private registry: AgentRegistry
  private executionEngine: ExecutionEngine
  private resultAggregator: ResultAggregator

  constructor() {
    this.registry = new AgentRegistry()
    this.executionEngine = new ExecutionEngine()
    this.resultAggregator = new ResultAggregator()
  }

  /**
   * Orchestrate a complex task using multiple specialized agents
   * @param request - User request to be processed
   * @param context - Current conversation and session context
   * @returns Promise resolving to orchestrated result
   */
  async orchestrate(request: string, context: OrchestrationContext): Promise<OrchestrationResult> {
    try {
      // 1. Analyze the request and decompose into tasks
      const taskAnalysis = await this.analyzeRequest(request, context)
      const tasks = await this.decomposeTasks(taskAnalysis)

      // 2. Select appropriate agents for each task
      const agentAssignments = await this.assignAgents(tasks)

      // 3. Create execution plan with dependencies
      const executionPlan = await this.createExecutionPlan(agentAssignments)

      // 4. Execute agents in parallel where possible
      const agentResults = await this.executionEngine.execute(executionPlan)

      // 5. Synthesize results into coherent response
      const finalResult = await this.resultAggregator.synthesize(agentResults, request)

      return {
        success: true,
        result: finalResult,
        metadata: {
          tasksExecuted: tasks.length,
          agentsUsed: agentAssignments.length,
          executionTime: Date.now() - taskAnalysis.startTime,
          totalCost: agentResults.reduce((sum, r) => sum + r.metadata.cost, 0)
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fallbackToTools: true
      }
    }
  }

  private async analyzeRequest(request: string, context: OrchestrationContext): Promise<TaskAnalysis> {
    // Use AI to analyze request complexity and requirements
    const analysis = await generateObject({
      model: openai(process.env.AGENT_ORCHESTRATOR_MODEL!),
      prompt: `Analyze this request for agent orchestration: "${request}"`,
      schema: z.object({
        complexity: z.enum(['simple', 'moderate', 'complex']),
        domains: z.array(z.enum(['planning', 'rag', 'vision', 'synthesis'])),
        requiresParallelism: z.boolean(),
        estimatedSteps: z.number(),
        priority: z.number()
      })
    })

    return {
      request,
      complexity: analysis.object.complexity,
      domains: analysis.object.domains,
      requiresParallelism: analysis.object.requiresParallelism,
      estimatedSteps: analysis.object.estimatedSteps,
      priority: analysis.object.priority,
      startTime: Date.now()
    }
  }
}
```

### Planner Agent Implementation
```typescript
// lib/agents/specialized/planner-agent.ts
/**
 * @fileoverview Specialized agent for task planning and decomposition
 */

export class PlannerAgent implements Agent {
  id = 'planner-agent'
  name = 'Task Planner'
  capabilities = [AgentCapability.TASK_DECOMPOSITION, AgentCapability.PLANNING]
  version = '1.0.0'

  async execute(task: AgentTask, context: AgentContext): Promise<AgentResult> {
    const startTime = Date.now()
    
    try {
      // Generate detailed execution plan
      const plan = await generateObject({
        model: openai(process.env.PLANNER_AGENT_MODEL!),
        prompt: `Create a detailed execution plan for: ${task.description}`,
        schema: z.object({
          steps: z.array(z.object({
            id: z.string(),
            description: z.string(),
            agent: z.enum(['rager', 'vision-tagger', 'synthesizer']),
            dependencies: z.array(z.string()),
            estimatedTime: z.number(),
            priority: z.number()
          })),
          parallelizable: z.array(z.array(z.string())),
          criticalPath: z.array(z.string()),
          estimatedTotalTime: z.number()
        })
      })

      const executionTime = Date.now() - startTime

      return {
        success: true,
        output: {
          plan: plan.object,
          planningStrategy: 'hierarchical-decomposition',
          confidence: 0.9
        },
        metadata: {
          executionTime,
          tokensUsed: plan.usage?.totalTokens || 0,
          cost: this.calculateCost(plan.usage?.totalTokens || 0),
          confidence: 0.9,
          agentId: this.id,
          timestamp: new Date()
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Planning failed: ${error.message}`,
        metadata: {
          executionTime: Date.now() - startTime,
          tokensUsed: 0,
          cost: 0,
          confidence: 0,
          agentId: this.id,
          timestamp: new Date()
        }
      }
    }
  }

  async canHandle(task: AgentTask): Promise<boolean> {
    return task.type === TaskType.PLANNING || 
           task.type === TaskType.TASK_DECOMPOSITION
  }

  async estimateCost(task: AgentTask): Promise<number> {
    // Estimate based on task complexity
    const baseTokens = 1000 // Base planning tokens
    const complexityMultiplier = task.requirements.length * 200
    return this.calculateCost(baseTokens + complexityMultiplier)
  }

  private calculateCost(tokens: number): number {
    // GPT-4 pricing: $0.01 per 1K tokens input, $0.03 per 1K tokens output
    return (tokens / 1000) * 0.02 // Average of input/output
  }
}
```

### Agent Tree Visualization
```typescript
// components/agents/agent-tree.tsx
/**
 * @fileoverview Interactive agent tree visualization for Developer View
 */

interface AgentTreeProps {
  orchestrationResult: OrchestrationResult
  isLive?: boolean
}

export function AgentTree({ orchestrationResult, isLive = false }: AgentTreeProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  return (
    <div className="font-mono text-xs bg-muted p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Agent Execution Tree</h3>
        <div className="flex gap-2">
          <Badge variant="outline">
            {orchestrationResult.metadata.agentsUsed} agents
          </Badge>
          <Badge variant="outline">
            {orchestrationResult.metadata.executionTime}ms
          </Badge>
          <Badge variant="outline">
            ${orchestrationResult.metadata.totalCost.toFixed(4)}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {/* Orchestrator root */}
        <div className="flex items-center gap-2 p-2 bg-purple-100 dark:bg-purple-900 rounded">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="font-medium">Orchestrator</span>
          <Badge variant="secondary">
            {orchestrationResult.success ? 'Completed' : 'Failed'}
          </Badge>
          {isLive && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Agent execution tree */}
        <div className="ml-4 border-l-2 border-muted-foreground/20 pl-4 space-y-2">
          {orchestrationResult.agentResults?.map((result, index) => (
            <AgentNode
              key={result.agentId}
              result={result}
              isSelected={selectedAgent === result.agentId}
              onSelect={() => setSelectedAgent(result.agentId)}
              depth={1}
            />
          ))}
        </div>
      </div>

      {/* Selected agent details */}
      {selectedAgent && (
        <div className="mt-4 p-3 bg-background border rounded">
          <AgentDetails agentId={selectedAgent} />
        </div>
      )}
    </div>
  )
}

function AgentNode({ result, isSelected, onSelect, depth }: AgentNodeProps) {
  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'planner-agent': return <Target className="w-4 h-4" />
      case 'rager-agent': return <Search className="w-4 h-4" />
      case 'vision-tagger-agent': return <Eye className="w-4 h-4" />
      case 'synthesizer-agent': return <Layers className="w-4 h-4" />
      default: return <Bot className="w-4 h-4" />
    }
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div 
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-muted/50'
      }`}
      onClick={onSelect}
    >
      {getAgentIcon(result.agentId)}
      <span className="font-medium">{result.agentId}</span>
      <Badge 
        variant="outline" 
        className={getStatusColor(result.success)}
      >
        {result.success ? 'Success' : 'Failed'}
      </Badge>
      <Badge variant="secondary" className="text-xs">
        {result.metadata.executionTime}ms
      </Badge>
      <Badge variant="secondary" className="text-xs">
        {result.metadata.tokensUsed} tokens
      </Badge>
    </div>
  )
}
```

---

## Testing Phase 4

**Agent System Tests**:
- [ ] Agent registry can discover and instantiate all specialized agents
- [ ] Agent lifecycle management (spawn, execute, terminate) works correctly
- [ ] Agent capability matching selects appropriate agents for tasks
- [ ] Agent communication protocol enables context sharing
- [ ] Agent retry and error recovery mechanisms function properly

**Orchestration Tests**:
- [ ] Orchestrator correctly analyzes and decomposes complex requests
- [ ] Parallel agent execution works with proper dependency management
- [ ] Result synthesis produces coherent combined outputs
- [ ] Agent selection logic chooses optimal agents for different task types
- [ ] Cost and performance tracking accurately measures agent usage

**Specialized Agent Tests**:
- [ ] Planner agent creates detailed, actionable execution plans
- [ ] RAGer agent provides enhanced document retrieval and synthesis
- [ ] VisionTagger agent performs advanced image analysis and tagging
- [ ] Synthesizer agent effectively combines outputs from multiple sources
- [ ] Each agent respects timeout limits and resource constraints

**Visualization Tests**:
- [ ] Agent tree displays correct delegation hierarchy
- [ ] Real-time status updates show agent progress accurately
- [ ] Agent interaction logs capture all communication
- [ ] Performance metrics track costs and execution times
- [ ] Agent debugging information helps with troubleshooting

**Integration Tests**:
- [ ] Agent mode integrates seamlessly with existing chat interface
- [ ] Agent results display properly in enhanced message bubbles
- [ ] Agent operations can be cancelled and interrupted
- [ ] Agent system gracefully falls back to tools when needed
- [ ] Developer View provides comprehensive agent debugging information

**User Scenarios**:
1. **Complex Research Task**: "Analyze the financial reports in these PDFs and create a summary with charts"
2. **Multimodal Analysis**: "Examine these product images and compare them with the specifications document"
3. **Multi-step Planning**: "Plan a marketing campaign based on competitor analysis and market research"
4. **Synthesis Task**: "Combine insights from multiple sources into a comprehensive report"
5. **Error Recovery**: Test agent behavior when individual agents fail or timeout
6. **Performance Comparison**: Compare agent results vs. simple tool calling for complex tasks

**Performance Tests**:
- [ ] Agent orchestration completes within reasonable time limits
- [ ] Parallel agent execution provides performance benefits
- [ ] Agent system scales with increasing task complexity
- [ ] Memory usage remains stable during agent operations
- [ ] Agent costs stay within configured limits

---

## Known Limitations

- Agent orchestration adds significant latency compared to simple tools
- Complex agent interactions can be difficult to debug and troubleshoot
- Agent costs can accumulate quickly with multiple parallel executions
- Agent system requires careful tuning of timeouts and retry logic
- Inter-agent communication may introduce points of failure
- Agent selection logic may not always choose optimal agents

---

## Next Phase Preview

Phase 5 will add manual mode toggling including:
- UI controls for switching between Tools-only, Agents, and Auto modes
- Performance comparison features between different modes
- Enhanced Developer View showing mode selection reasoning
- User preference storage for default mode selection
- Cost and quality analysis across different execution modes
