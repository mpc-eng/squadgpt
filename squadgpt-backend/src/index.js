const fastify = require('fastify')();
require('dotenv').config();

// Import LangChain components
const { ChatOpenAI } = require('@langchain/openai');
const { LLMChain } = require('langchain/chains');
const { PromptTemplate } = require('@langchain/core/prompts');

// Security and validation imports
const rateLimit = require('@fastify/rate-limit');
const helmet = require('@fastify/helmet');

// Input validation schemas
const ideaSubmissionSchema = {
  type: 'object',
  required: ['idea'],
  properties: {
    idea: { type: 'string', minLength: 10, maxLength: 2000 },
    stage: { type: 'string', enum: ['Aperture', 'Discovery', 'Define', 'Design', 'Deliver', 'Live'] },
    prdContext: { type: 'string', maxLength: 5000 }
  }
};

const chatSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string', minLength: 1, maxLength: 1000 },
    stage: { type: 'string', enum: ['Aperture', 'Discovery', 'Define', 'Design', 'Deliver', 'Live'] },
    prdContext: { type: 'string', maxLength: 5000 },
    conversationHistory: { type: 'array', items: { type: 'object' } }
  }
};

// Register security plugins
fastify.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: function (request, context) {
    return {
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after
    }
  }
});

// Register CORS plugin with proper configuration
fastify.register(require('@fastify/cors'), {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Global error handler
fastify.setErrorHandler(function (error, request, reply) {
  console.error('Global error:', error);
  
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: 'Validation Error',
      details: error.validation
    });
  }
  
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: 'Rate limit exceeded',
      retryAfter: error.headers['retry-after']
    });
  }
  
  reply.status(500).send({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
});

// Initialize OpenAI LLM with low temperature for deterministic outputs
const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.2,
  modelName: 'gpt-3.5-turbo'
});

// Create the four LangChain agents with PromptTemplates

// 1. Business Analyst Agent - converts idea to user stories
const businessAnalystTemplate = new PromptTemplate({
  inputVariables: ['idea', 'stage', 'prdContext'],
  template: `You are the Business Analyst. The team is in the {stage} phase of product discovery. Focus your response on what matters during this phase.

Current PRD Context:
{prdContext}

Project Idea: {idea}

Please create comprehensive user stories that cover:
- User personas and their goals
- Functional requirements
- Acceptance criteria
- User journey flows

Focus your analysis on the {stage} phase considerations and ensure your user stories align with the current PRD context.

Format your response as a detailed list of user stories with clear acceptance criteria.`
});

const businessAnalystChain = new LLMChain({
  llm: llm,
  prompt: businessAnalystTemplate
});

// 2. Product Manager Agent - converts user stories to PRD
const productManagerTemplate = new PromptTemplate({
  inputVariables: ['userStories', 'stage', 'prdContext'],
  template: `You are the Product Manager. The team is in the {stage} phase of product discovery. Focus your response on what matters during this phase.

Current PRD Context:
{prdContext}

User Stories:
{userStories}

Please create a detailed PRD that includes:
- Product overview and vision
- Target audience and market analysis
- Feature specifications
- Success metrics and KPIs
- Technical requirements overview
- Timeline and milestones
- Risk assessment

Focus your PRD development on the {stage} phase priorities and build upon the existing PRD context.

Format your response as a structured PRD document.`
});

const productManagerChain = new LLMChain({
  llm: llm,
  prompt: productManagerTemplate
});

// 3. Solution Architect Agent - converts PRD to technical architecture
const solutionArchitectTemplate = new PromptTemplate({
  inputVariables: ['prd', 'stage', 'prdContext'],
  template: `You are the Solution Architect. The team is in the {stage} phase of product discovery. Focus your response on what matters during this phase.

Current PRD Context:
{prdContext}

PRD:
{prd}

Please create a comprehensive technical architecture that includes:
- System architecture overview
- Technology stack recommendations
- Database design
- API design and endpoints
- Security considerations
- Scalability and performance requirements
- Deployment strategy
- Third-party integrations needed

Focus your technical architecture on the {stage} phase requirements and ensure alignment with the current PRD context.

Format your response as a detailed technical architecture document.`
});

const solutionArchitectChain = new LLMChain({
  llm: llm,
  prompt: solutionArchitectTemplate
});

// 4. Scrum Master Agent - converts architecture to development tasks
const scrumMasterTemplate = new PromptTemplate({
  inputVariables: ['architecture', 'stage', 'prdContext'],
  template: `You are the Scrum Master. The team is in the {stage} phase of product discovery. Focus your response on what matters during this phase.

Current PRD Context:
{prdContext}

Technical Architecture:
{architecture}

Please create a comprehensive development plan that includes:
- Sprint breakdown (2-week sprints)
- User stories with story points
- Technical tasks with time estimates
- Dependencies between tasks
- Definition of Done criteria
- Risk mitigation tasks
- Testing and QA tasks

Focus your development planning on the {stage} phase priorities and ensure tasks align with the current PRD context.

Format your response as a detailed sprint plan with tasks, estimates, and dependencies.`
});

const scrumMasterChain = new LLMChain({
  llm: llm,
  prompt: scrumMasterTemplate
});

// 5. PRD Summarizer Agent - summarizes PRD sections
const prdSummarizerTemplate = new PromptTemplate({
  inputVariables: ['section', 'content', 'stage'],
  template: `You are a Product Manager in the {stage} phase of product discovery. You are tasked with summarizing a PRD section. Please provide a clear, concise summary of the following {section}:

Content:
{content}

Please provide a professional summary that:
- Captures the key points and insights relevant to the {stage} phase
- Is well-structured and easy to read
- Maintains the original intent and meaning
- Is suitable for executive review
- Focuses on what matters most during the {stage} phase

Format your response as a clear, professional summary.`
});

const prdSummarizerChain = new LLMChain({
  llm: llm,
  prompt: prdSummarizerTemplate
});

// 6. Chat Agent - handles conversational interactions with PRD context
const chatTemplate = new PromptTemplate({
  inputVariables: ['stage', 'prdContext', 'conversationHistory', 'message'],
  template: `You are an AI assistant helping with product development in the {stage} stage of the PRD process.

Current PRD Context:
{prdContext}

Previous conversation:
{conversationHistory}

User's current message: {message}

Please provide a helpful, professional response that:
- Is relevant to the current PRD stage ({stage})
- Uses the provided PRD context when applicable
- Maintains conversation flow
- Provides actionable insights and guidance
- Is concise but comprehensive

Respond in a conversational, helpful tone.`
});

const chatChain = new LLMChain({
  llm: llm,
  prompt: chatTemplate
});

// 7. Agent Debate Summarizer - summarizes agent opinions and suggests direction
const agentDebateTemplate = new PromptTemplate({
  inputVariables: ['agentResponses'],
  template: `You are a Product Strategy Consultant tasked with analyzing the opinions of different team members and providing a consensus summary.

Agent Responses:
{agentResponses}

Please provide a comprehensive analysis that includes:

1. **Key Trade-offs Identified**: What are the main conflicts or trade-offs between different perspectives?

2. **Consensus Points**: What do the agents generally agree on?

3. **Critical Decisions**: What are the most important decisions that need to be made?

4. **Recommended Direction**: Based on the analysis, what direction would you recommend moving forward?

5. **Risk Assessment**: What are the main risks and how should they be mitigated?

6. **Next Steps**: What should be the immediate next steps for the team?

Format your response as a structured analysis with clear sections and actionable recommendations.`
});

const agentDebateChain = new LLMChain({
  llm: llm,
  prompt: agentDebateTemplate
});

// Main workflow function that chains all agents
async function runLangChainWorkflow(idea, stage = 'Aperture', prdContext = '') {
  try {
    console.log(`Starting LangChain workflow for idea in ${stage} stage:`, idea);

    // Step 1: Business Analyst - Idea to User Stories
    console.log('Step 1: Business Analyst generating user stories...');
    const userStoriesResult = await businessAnalystChain.call({ 
      idea, 
      stage, 
      prdContext 
    });
    const userStories = userStoriesResult.text;
    console.log('User stories generated successfully');

    // Step 2: Product Manager - User Stories to PRD
    console.log('Step 2: Product Manager generating PRD...');
    const prdResult = await productManagerChain.call({ 
      userStories, 
      stage, 
      prdContext 
    });
    const prd = prdResult.text;
    console.log('PRD generated successfully');

    // Step 3: Solution Architect - PRD to Architecture
    console.log('Step 3: Solution Architect generating technical architecture...');
    const architectureResult = await solutionArchitectChain.call({ 
      prd, 
      stage, 
      prdContext 
    });
    const architecture = architectureResult.text;
    console.log('Technical architecture generated successfully');

    // Step 4: Scrum Master - Architecture to Development Tasks
    console.log('Step 4: Scrum Master generating development tasks...');
    const devTasksResult = await scrumMasterChain.call({ 
      architecture, 
      stage, 
      prdContext 
    });
    const devTasks = devTasksResult.text;
    console.log('Development tasks generated successfully');

    return {
      success: true,
      userStories,
      prd,
      architecture,
      devTasks
    };
  } catch (error) {
    console.error('Error in LangChain workflow:', error);
    throw new Error(`LangChain workflow failed: ${error.message}`);
  }
}

// PRD section summarization function
async function summarizePRDSection(section, content, stage = 'Aperture') {
  try {
    console.log(`Summarizing PRD section: ${section} in ${stage} stage`);
    
    const result = await prdSummarizerChain.call({ 
      section: section.replace(/([A-Z])/g, ' $1').toLowerCase(),
      content: Array.isArray(content) ? content.join('\n') : content,
      stage
    });
    
    console.log('PRD section summarized successfully');
    return result.text;
  } catch (error) {
    console.error('Error summarizing PRD section:', error);
    throw new Error(`PRD summarization failed: ${error.message}`);
  }
}

// Chat function with PRD context
async function handleChat(stage, prdContext, conversationHistory, message) {
  try {
    console.log(`Processing chat message in ${stage} stage`);
    
    // Format conversation history for the prompt
    const formattedHistory = conversationHistory.length > 0 
      ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : 'No previous conversation.';
    
    const result = await chatChain.call({
      stage,
      prdContext: prdContext || 'No PRD context available.',
      conversationHistory: formattedHistory,
      message
    });
    
    console.log('Chat response generated successfully');
    return result.text;
  } catch (error) {
    console.error('Error processing chat:', error);
    throw new Error(`Chat processing failed: ${error.message}`);
  }
}

// Agent debate summarization function
async function summarizeAgentDebate(agentResponses) {
  try {
    console.log('Summarizing agent debate with', agentResponses.length, 'agents');
    
    // Format agent responses for the prompt
    const formattedResponses = agentResponses.map(agent => 
      `${agent.name} (${agent.role})${agent.confidence ? ` [Confidence: ${agent.confidence}%]` : ''}:\n${agent.response}`
    ).join('\n\n');
    
    const result = await agentDebateChain.call({
      agentResponses: formattedResponses
    });
    
    console.log('Agent debate summary generated successfully');
    return result.text;
  } catch (error) {
    console.error('Error summarizing agent debate:', error);
    throw new Error(`Agent debate summarization failed: ${error.message}`);
  }
}

// POST route for idea submission with LangChain workflow
fastify.post('/api/idea/submit', {
  schema: {
    body: ideaSubmissionSchema
  }
}, async (request, reply) => {
  try {
    const { idea, stage = 'Aperture', prdContext = '' } = request.body;

    console.log(`Received idea submission in ${stage} stage:`, idea);

    // Run the LangChain workflow with stage and PRD context
    const result = await runLangChainWorkflow(idea, stage, prdContext);

    // TODO: Optional - Save to PostgreSQL database
    // await saveToDatabase({
    //   project_name: idea,
    //   user_stories: result.userStories,
    //   prd: result.prd,
    //   architecture: result.architecture,
    //   dev_tasks: result.devTasks
    // });

    return result;
  } catch (error) {
    console.error('Error processing idea submission:', error);
    return reply.code(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST route for PRD section summarization
fastify.post('/api/prd/summarize', {
  schema: {
    body: {
      type: 'object',
      required: ['section', 'content'],
      properties: {
        section: { type: 'string', minLength: 1 },
        content: { type: 'string', minLength: 1 },
        stage: { type: 'string', enum: ['Aperture', 'Discovery', 'Define', 'Design', 'Deliver', 'Live'] }
      }
    }
  }
}, async (request, reply) => {
  try {
    const { section, content, stage = 'Aperture' } = request.body;

    console.log(`Received PRD summarization request in ${stage} stage:`, { section, content });

    // Run the PRD summarization
    const summary = await summarizePRDSection(section, content, stage);

    return {
      success: true,
      summary
    };
  } catch (error) {
    console.error('Error processing PRD summarization:', error);
    return reply.code(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST route for chat with PRD context
fastify.post('/api/chat', {
  schema: {
    body: chatSchema
  }
}, async (request, reply) => {
  try {
    const { message, stage, prdContext, conversationHistory } = request.body;

    console.log('Received chat request:', { stage, messageLength: message.length });

    // Run the chat processing
    const response = await handleChat(stage, prdContext, conversationHistory || [], message);

    return {
      success: true,
      response
    };
  } catch (error) {
    console.error('Error processing chat:', error);
    return reply.code(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// POST route for agent debate summarization
fastify.post('/api/agents/summarize', async (request, reply) => {
  try {
    const { agentResponses } = request.body;
    
    // Validate input
    if (!agentResponses || !Array.isArray(agentResponses) || agentResponses.length === 0) {
      return reply.code(400).send({
        success: false,
        error: 'Agent responses array is required and must not be empty'
      });
    }

    console.log('Received agent debate summarization request:', { agentCount: agentResponses.length });

    // Run the agent debate summarization
    const summary = await summarizeAgentDebate(agentResponses);

    return {
      success: true,
      summary
    };
  } catch (error) {
    console.error('Error processing agent debate summarization:', error);
    return reply.code(500).send({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Start server on port 3001
fastify.listen({ port: 3001, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
  console.log('Available routes:');
  console.log('- POST /api/idea/submit');
  console.log('- POST /api/prd/summarize');
  console.log('- POST /api/chat');
  console.log('- POST /api/agents/summarize');
  console.log('- GET /health');
  console.log('LangChain workflow ready!');
});

// Optional: Database save function for future use
async function saveToDatabase(data) {
  // TODO: Implement PostgreSQL connection and save
  // Example structure:
  // const query = `
  //   INSERT INTO ideas (project_name, user_stories, prd, architecture, dev_tasks, created_at)
  //   VALUES ($1, $2, $3, $4, $5, NOW())
  //   RETURNING id
  // `;
  // const values = [data.project_name, data.user_stories, data.prd, data.architecture, data.dev_tasks];
  // const result = await pool.query(query, values);
  // return result.rows[0];
}
