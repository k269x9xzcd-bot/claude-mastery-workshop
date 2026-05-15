// Claude Mastery Workshop — app.js
// React 18 PWA, no build step, Babel transpiles JSX via CDN

const { useState, useEffect, useReducer, useRef, useCallback } = React;

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'claude_workshop_state';

const LEVELS = [
  { id: 1, name: 'Apprentice',   minXP: 0,    icon: '🌱', color: '#6b7280' },
  { id: 2, name: 'Explorer',     minXP: 200,  icon: '🔭', color: '#3b82f6' },
  { id: 3, name: 'Practitioner', minXP: 500,  icon: '⚡', color: '#8b7cf8' },
  { id: 4, name: 'Expert',       minXP: 1000, icon: '🎯', color: '#d4856a' },
  { id: 5, name: 'Master',       minXP: 2000, icon: '✦', color: '#f59e0b' },
];

const BADGES = [
  { id: 'first_lesson',    name: 'First Steps',    desc: 'Complete your first lesson',         icon: '👣', xp: 10  },
  { id: 'prompt_pro',      name: 'Prompt Pro',      desc: 'Complete Prompt Engineering module', icon: '✍️', xp: 50  },
  { id: 'api_explorer',    name: 'API Explorer',    desc: 'Complete the API module',            icon: '🔌', xp: 75  },
  { id: 'mcp_builder',     name: 'MCP Builder',     desc: 'Complete MCP Intro module',          icon: '🔧', xp: 75  },
  { id: 'agent_architect', name: 'Agent Architect', desc: 'Complete Agent Skills module',       icon: '🤖', xp: 100 },
  { id: 'streak_3',        name: 'On a Roll',       desc: '3-day learning streak',              icon: '🔥', xp: 25  },
  { id: 'streak_7',        name: 'Week Warrior',    desc: '7-day learning streak',              icon: '⚡', xp: 75  },
  { id: 'quiz_master',     name: 'Quiz Master',     desc: 'Ace 5 quizzes in a row',            icon: '🎯', xp: 50  },
  { id: 'speed_learner',   name: 'Speed Learner',   desc: 'Complete a module in one session',   icon: '🚀', xp: 30  },
  { id: 'completionist',   name: 'Completionist',   desc: 'Complete all 8 modules',             icon: '🏆', xp: 200 },
];

const COURSES = [
  { title: 'Anthropic Courses',         url: 'https://anthropic.com/learn',                                                                  category: 'Official'  },
  { title: 'Prompt Engineering Guide',  url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',              category: 'Prompting' },
  { title: 'Claude API Documentation',  url: 'https://docs.anthropic.com',                                                                    category: 'API'       },
  { title: 'Model Context Protocol',    url: 'https://modelcontextprotocol.io',                                                               category: 'MCP'       },
  { title: 'Claude Code Docs',          url: 'https://docs.anthropic.com/en/docs/claude-code/overview',                                       category: 'Tools'     },
  { title: 'Anthropic Cookbook',        url: 'https://github.com/anthropics/anthropic-cookbook',                                              category: 'Examples'  },
  { title: 'Tool Use Guide',            url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use',                                 category: 'API'       },
  { title: 'Vision Guide',             url: 'https://docs.anthropic.com/en/docs/build-with-claude/vision',                                    category: 'API'       },
  { title: 'Streaming Guide',          url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming',                                 category: 'API'       },
  { title: 'Models Overview',          url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview',                                category: 'API'       },
  { title: 'Safety & Responsible Use', url: 'https://www.anthropic.com/safety',                                                               category: 'Safety'    },
  { title: 'MCP GitHub',               url: 'https://github.com/modelcontextprotocol',                                                        category: 'MCP'       },
  { title: 'Anthropic Blog',           url: 'https://www.anthropic.com/blog',                                                                 category: 'News'      },
];

const MODULES = [
  {
    id: 'mod1', title: 'Claude 101', subtitle: 'Understand what Claude is and how to use it effectively',
    track: 'Foundation', icon: '✦', xpReward: 100,
    cards: [
      { type: 'concept', title: 'What Is Claude?', body: 'Claude is an AI assistant made by Anthropic — a safety-focused AI company. Claude is trained to be helpful, harmless, and honest. It excels at reasoning, writing, coding, and complex analysis.' },
      { type: 'concept', title: 'The Four Access Modes', body: 'Claude is available in four contexts:\n• Chat (claude.ai) — conversational web/mobile interface\n• API — build your own Claude-powered apps\n• Claude Code — CLI agent for software development\n• Cowork — desktop automation and file management\n\nEach has different capabilities and use cases.' },
      { type: 'concept', title: 'Context Window', body: 'Claude processes conversations in a "context window" — the working memory for a session. Claude Sonnet 4 supports up to 200K tokens (~150K words). Within a session, Claude remembers everything. Across sessions, it starts fresh unless you use memory tools or Projects.' },
      { type: 'template', title: 'The RACE Framework', body: 'Role + Action + Context + Expectation\n\n"You are a [ROLE]. [ACTION] about [CONTEXT]. Format your response as [EXPECTATION]."\n\nExample:\n"You are a senior product manager. Analyze this feature request from a user perspective. Format as a 3-point summary with pros, cons, and recommendation."' },
    ],
    quiz: [
      { q: 'Who makes Claude?', options: ['OpenAI', 'Google', 'Anthropic', 'Meta'], answer: 2, explanation: 'Claude is made by Anthropic, an AI safety company founded in 2021.' },
      { q: 'What does "context window" mean?', options: ['The physical window on your screen', 'The working memory for a conversation session', 'A type of browser extension', 'The maximum file size Claude can read'], answer: 1, explanation: 'The context window is Claude\'s working memory — everything in a session that Claude can see and reference.' },
      { q: 'Which of these is NOT a Claude access mode?', options: ['Chat (claude.ai)', 'API', 'Plugin Store', 'Claude Code'], answer: 2, explanation: 'The four modes are Chat, API, Claude Code, and Cowork. There is no standalone "Plugin Store" mode.' },
    ],
    challenge: 'Open claude.ai and try the RACE framework. Ask Claude to act as a specific expert (doctor, lawyer, teacher) and give advice on something you\'re curious about. Notice how specifying a role affects the response style.',
    deepDive: 'Read the Anthropic model card and acceptable use policy to understand Claude\'s design philosophy and safety guidelines.',
    externalLink: 'https://docs.anthropic.com/en/docs/about-claude/models/overview',
  },
  {
    id: 'mod2', title: 'Prompt Engineering', subtitle: 'Master the art of communicating with AI',
    track: 'Foundation', icon: '✍️', xpReward: 150,
    cards: [
      { type: 'concept', title: 'Clarity Over Cleverness', body: 'The best prompts are specific and clear. Tell Claude exactly what you want, who the audience is, and what format you expect. Ambiguity leads to generic responses. Be direct — Claude is not trying to read your mind.' },
      { type: 'concept', title: 'Few-Shot Examples', body: 'Show Claude examples of what you want before giving the real task:\n\n"Here are two examples of the format I\'m looking for:\n[Example A]...\n[Example B]...\n\nNow do the same for..."\n\nThis dramatically improves output consistency and format adherence.' },
      { type: 'concept', title: 'Chain of Thought', body: 'For complex reasoning tasks, ask Claude to "think step by step" or "reason through this carefully before answering." This activates more deliberate reasoning and significantly reduces errors on math, logic, and multi-step problems.' },
      { type: 'concept', title: 'XML Tags for Structure', body: 'Use XML tags to organize complex prompts:\n<context>background info</context>\n<instructions>what to do</instructions>\n<examples>sample outputs</examples>\n<format>desired structure</format>\n\nClaude was trained on XML-structured data and responds very well to this pattern.' },
      { type: 'template', title: 'The Perfect Prompt Formula', body: '<role>You are an expert [DOMAIN].</role>\n<context>[RELEVANT BACKGROUND]</context>\n<task>[SPECIFIC TASK]</task>\n<format>[OUTPUT FORMAT: bullet list / JSON / paragraph / table]</format>\n<constraints>[WORD LIMIT, TONE, RESTRICTIONS]</constraints>' },
    ],
    quiz: [
      { q: 'What is "few-shot prompting"?', options: ['Using very short prompts', 'Providing examples of desired output before the actual task', 'Asking Claude to be brief', 'Using a smaller model'], answer: 1, explanation: 'Few-shot prompting means providing 2–5 examples of the format/style you want before giving Claude the actual task.' },
      { q: 'What does "chain of thought" prompting do?', options: ['Links multiple Claude sessions together', 'Asks Claude to reason step by step before answering', 'Creates memory between conversations', 'Generates longer responses automatically'], answer: 1, explanation: 'Chain of thought prompting asks Claude to reason through a problem step by step, activating more deliberate and accurate reasoning.' },
    ],
    challenge: 'Take a mediocre prompt you\'ve used before and rewrite it using the Perfect Prompt Formula with XML tags. Run both versions and compare the output quality. What changed most?',
    deepDive: 'Explore the full Anthropic Prompt Engineering Guide. It covers advanced techniques like constitutional prompting, multi-turn optimization, and edge case handling.',
    externalLink: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
  },
  {
    id: 'mod3', title: 'AI Fluency', subtitle: 'Think and communicate like an AI-native professional',
    track: 'Foundation', icon: '🧠', xpReward: 100,
    cards: [
      { type: 'concept', title: 'AI-Native Thinking', body: 'AI-native professionals think in delegation: "What can Claude do, and what requires my judgment?" They draft with AI and edit with expertise. They iterate rather than perfect on the first try. The skill is knowing when to trust and when to verify.' },
      { type: 'concept', title: 'Hallucinations and Trust', body: 'Claude can be confidently wrong — this is called hallucination. For facts, citations, dates, and code: always verify independently. Claude is excellent at reasoning, synthesis, and generation — but it\'s not a search engine and its training has a cutoff date.' },
      { type: 'concept', title: 'The Collaboration Mental Model', body: 'Think of Claude as a brilliant, eager collaborator with no long-term memory and encyclopedic but potentially stale knowledge.\n\nYou provide: current context, domain judgment, final verification.\nClaude provides: pattern matching, writing speed, tireless iteration, and broad synthesis.' },
    ],
    quiz: [
      { q: 'What is AI "hallucination"?', options: ['When Claude generates images', 'When Claude fabricates information with confidence', 'When Claude refuses to answer', 'When Claude gives very long answers'], answer: 1, explanation: 'Hallucination is when an AI model generates false or fabricated information with the same confidence as true information. Always verify.' },
      { q: 'What should you always do with Claude\'s factual claims?', options: ['Trust them completely', 'Ignore them entirely', 'Verify independently before relying on them', 'Ask Claude twice to confirm'], answer: 2, explanation: 'Claude can be confidently wrong. Always verify facts, citations, and code independently before relying on them in important contexts.' },
    ],
    challenge: 'Ask Claude a factual question you know the answer to, then ask about something recent or obscure. Notice where Claude\'s confidence exceeds its accuracy. Practice adding "please flag your uncertainty" to your prompts.',
    deepDive: 'Read about Anthropic\'s Constitutional AI approach to understand how Claude\'s values and safety behaviors are trained into the model.',
    externalLink: 'https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback',
  },
  {
    id: 'mod4', title: 'Claude API', subtitle: 'Build applications with the Messages API',
    track: 'Developer', icon: '🔌', xpReward: 200,
    cards: [
      { type: 'concept', title: 'The Messages API', body: 'The Claude API uses a simple messages format: you send an array of messages with roles ("user" and "assistant"), and Claude returns a completion. Every Claude integration — from chatbots to agents — is built on this foundation.' },
      { type: 'concept', title: 'Key Parameters', body: '• model — which Claude version (e.g., "claude-sonnet-4-6")\n• max_tokens — maximum response length\n• temperature — 0=deterministic, 1=creative (default 1)\n• system — persistent instructions prepended to all turns\n• messages — the conversation history array' },
      { type: 'concept', title: 'Streaming', body: 'For real-time UIs, use streaming to receive tokens as they\'re generated. Set stream=True in Python or use the .stream() method in the SDK. This dramatically improves perceived performance — users see text appearing immediately.' },
      { type: 'concept', title: 'Tool Use (Function Calling)', body: 'Tool use lets Claude call external functions. You define tools with JSON schemas, Claude decides when to call them, you execute the call, and return results. This enables Claude to browse the web, query databases, and take real-world actions.' },
      { type: 'template', title: 'Basic API Call (Python)', body: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nmessage = client.messages.create(\n    model="claude-sonnet-4-6",\n    max_tokens=1024,\n    system="You are a helpful assistant.",\n    messages=[\n        {"role": "user", "content": "Hello, Claude!"}\n    ]\n)\n\nprint(message.content[0].text)' },
    ],
    quiz: [
      { q: 'What are the two valid "role" values in the Messages API?', options: ['"human" and "ai"', '"user" and "assistant"', '"prompt" and "response"', '"input" and "output"'], answer: 1, explanation: 'The Messages API uses "user" and "assistant" as the two role values for conversation turns.' },
      { q: 'What does setting temperature=0 do?', options: ['Makes Claude respond faster', 'Makes Claude refuse unsafe requests', 'Makes responses more deterministic/consistent', 'Disables creativity entirely'], answer: 2, explanation: 'Temperature=0 makes Claude\'s responses more deterministic. Ideal for structured output and code generation.' },
    ],
    challenge: 'Using the Anthropic Python SDK, write a script that takes a URL as input, fetches its text content, passes it to Claude, and outputs structured JSON with: title, 3-sentence summary, and 5 key takeaways.',
    deepDive: 'Explore the Tool Use documentation. Build a simple weather tool: define the schema, send it to Claude, handle the tool_use block, return results, get the final response.',
    externalLink: 'https://docs.anthropic.com/en/api/getting-started',
  },
  {
    id: 'mod5', title: 'MCP Intro', subtitle: 'Connect Claude to real-world tools and data',
    track: 'Developer', icon: '🔧', xpReward: 200,
    cards: [
      { type: 'concept', title: 'What Is MCP?', body: 'Model Context Protocol (MCP) is an open standard for connecting AI assistants to external tools and data. Think of it as USB for AI — any MCP-compatible client (Claude, Cursor, VS Code) can connect to any MCP server without custom integration work.' },
      { type: 'concept', title: 'Three Primitives', body: 'MCP servers expose three capability types:\n• Tools — functions Claude can call (query DB, send email, fetch data)\n• Resources — data Claude can read (files, database rows, API responses)\n• Prompts — pre-built prompt templates users can invoke\n\nMnemonic: Tools=actions, Resources=context, Prompts=shortcuts.' },
      { type: 'concept', title: 'The MCP Architecture', body: 'Client (Claude) ↔ MCP Server ↔ External Service\n\nThe MCP server acts as a translator. Claude asks "query the database for user 123" → MCP server converts to SQL → executes → returns formatted results to Claude. Claude never touches the external service directly.' },
      { type: 'template', title: 'FastMCP Minimal Server (Python)', body: 'from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP("my-server")\n\n@mcp.tool()\ndef get_weather(city: str) -> str:\n    """Get current weather for a city."""\n    # Call real weather API here\n    return f"Weather in {city}: Sunny, 72°F"\n\nif __name__ == "__main__":\n    mcp.run()' },
    ],
    quiz: [
      { q: 'What does MCP stand for?', options: ['Machine Control Protocol', 'Model Context Protocol', 'Multi-Claude Pipeline', 'Managed Cloud Platform'], answer: 1, explanation: 'MCP stands for Model Context Protocol — an open standard for connecting AI assistants to external tools and data sources.' },
      { q: 'What is an MCP "Tool"?', options: ['A physical device for using Claude', 'A function that Claude can call to take actions', 'A type of Claude model variant', 'A pre-built prompt template'], answer: 1, explanation: 'MCP Tools are callable functions — like querying a database, sending an email, or fetching data. They enable Claude to take actions.' },
    ],
    challenge: 'Install the MCP CLI and connect to the filesystem MCP server. Ask Claude to read a file on your computer and summarize its contents. Then ask it to create a new file containing the summary.',
    deepDive: 'Read the full MCP specification at modelcontextprotocol.io. Understand the difference between STDIO and SSE transports and when each is appropriate.',
    externalLink: 'https://modelcontextprotocol.io/introduction',
  },
  {
    id: 'mod6', title: 'MCP Advanced', subtitle: 'Build production-ready MCP servers',
    track: 'Developer', icon: '⚡', xpReward: 250,
    cards: [
      { type: 'concept', title: 'Authentication & Security', body: 'Production MCP servers need proper auth. Use OAuth 2.0 for user-scoped access, API keys for service-to-service calls. Always validate and sanitize inputs — never trust client-supplied data. Log all tool calls for audit trails and debugging.' },
      { type: 'concept', title: 'Resources vs Tools — The Right Separation', body: 'Resources are for reading data (GET-like): files, database records, API data.\nTools are for taking actions (POST-like): creating records, sending messages, calling write APIs.\n\nDesign your server with this separation clearly in mind — it helps Claude reason about what it can and cannot do.' },
      { type: 'concept', title: 'Sampling — Claude Calls Claude', body: 'MCP supports "sampling" — your MCP server can ask Claude to generate text as part of processing a tool call. This enables autonomous agents where Claude invokes sub-Claude processes. Be careful with cost and infinite loop risks.' },
      { type: 'template', title: 'MCP Server with Error Handling', body: 'from mcp.server.fastmcp import FastMCP\nfrom mcp.types import McpError, ErrorCode\n\nmcp = FastMCP("secure-server")\n\nALLOWED_TABLES = {"users", "products", "orders"}\n\n@mcp.tool()\ndef query_records(table: str, limit: int = 10) -> list:\n    """Query records from an allowed table."""\n    if table not in ALLOWED_TABLES:\n        raise McpError(\n            ErrorCode.InvalidParams,\n            f"Table {table!r} is not accessible"\n        )\n    limit = min(limit, 100)\n    return db.query(f"SELECT * FROM {table} LIMIT {limit}")' },
    ],
    quiz: [
      { q: 'What is MCP "sampling"?', options: ['Testing a small portion of your data', 'An MCP server requesting Claude to generate text', 'Audio sampling rate configuration', 'A random selection of available tools'], answer: 1, explanation: 'Sampling in MCP allows your server to request Claude (the host LLM) to generate text as part of processing — enabling recursive agent behaviors.' },
      { q: 'Which is a Resource (not a Tool) use case?', options: ['Sending an email', 'Creating a database record', 'Reading a user\'s profile data', 'Posting to social media'], answer: 2, explanation: 'Resources are for reading/fetching data. Reading a profile is a read operation. Sending, creating, and posting are write actions that belong as Tools.' },
    ],
    challenge: 'Build a production-ready MCP server for a real service you use (GitHub, Notion, Slack). Implement at least 3 tools with proper error handling, input validation, and descriptive docstrings.',
    deepDive: 'Study MCP security best practices. Implement rate limiting for your server to prevent abuse and runaway agent loops. Add structured logging for all tool invocations.',
    externalLink: 'https://modelcontextprotocol.io/specification',
  },
  {
    id: 'mod7', title: 'Agent Skills', subtitle: 'Build and orchestrate autonomous Claude agents',
    track: 'Developer', icon: '🤖', xpReward: 300,
    cards: [
      { type: 'concept', title: 'What Is an Agent?', body: 'An AI agent is a Claude instance that takes sequences of actions to complete complex tasks — browsing the web, writing and running code, managing files, calling APIs — with minimal human intervention. Agents plan, act, observe, and iterate.' },
      { type: 'concept', title: 'The Agent Loop', body: 'Plan → Act → Observe → Reflect → Plan\n\nClaude receives a goal, plans sub-tasks, uses tools to act, observes results, reflects on progress, and continues until done (or stuck). Design agents to handle failure gracefully at each step.' },
      { type: 'concept', title: 'Multi-Agent Orchestration', body: 'Complex tasks benefit from specialized agents:\n• Orchestrator — decomposes tasks, routes to specialists\n• Researcher — web search, data gathering\n• Coder — writes and runs code\n• Writer — produces final output\n\nResults are aggregated. This mirrors how high-performing human teams work.' },
      { type: 'concept', title: 'Human-in-the-Loop', body: 'The best agents know when to pause and ask. Design explicit checkpoints for high-stakes decisions.\n\nGolden rule: agents can proceed autonomously for reversible actions (read, search, draft). They must confirm for irreversible ones (delete, send, pay, publish).' },
      { type: 'template', title: 'Agent System Prompt Template', body: 'You are an autonomous agent with access to these tools:\n[LIST TOOLS WITH DESCRIPTIONS]\n\nGoal: [TASK DESCRIPTION]\n\nRules:\n1. Think step-by-step before acting\n2. Use tools only when needed — prefer reasoning first\n3. Verify results before proceeding\n4. If uncertain, ask for clarification\n5. Stop and report if you encounter an unrecoverable error\n\nBegin by stating your plan, then execute it.' },
    ],
    quiz: [
      { q: 'What is the agent loop?', options: ['A circular reference error in code', 'Plan → Act → Observe → Reflect → Plan', 'Input → Process → Output', 'A loop that runs multiple agents in parallel'], answer: 1, explanation: 'The agent loop is the cycle of Plan → Act → Observe → Reflect → Plan that autonomous agents use to accomplish complex tasks iteratively.' },
      { q: 'For which action should an agent ALWAYS require human confirmation?', options: ['Reading a file', 'Searching the web', 'Permanently deleting a database record', 'Generating a text summary'], answer: 2, explanation: 'Irreversible actions (delete, send, pay, publish) should always require human confirmation. Reversible actions can proceed autonomously.' },
    ],
    challenge: 'Build a research agent using the Anthropic API + tool use. Give it web search and file-writing tools. Task it with: "Research the top 3 MCP servers on GitHub by stars, summarize each, and save a markdown report to research.md".',
    deepDive: 'Study how Claude Code is built as a production agent. Analyze its tool design, context management, and safety checks to inform your own agent architecture.',
    externalLink: 'https://docs.anthropic.com/en/docs/agents-and-tools/computer-use',
  },
  {
    id: 'bonus', title: 'Cowork + Dispatch', subtitle: 'Automate your desktop with AI-native workflows',
    track: 'Bonus', icon: '🚀', xpReward: 150,
    cards: [
      { type: 'concept', title: 'What Is Cowork?', body: 'Cowork is Claude\'s desktop automation mode, running in the Claude desktop app. It can read and write files on your Mac, execute code, manage your workspace, and work alongside your daily apps — all in a persistent session. You\'re in one right now.' },
      { type: 'concept', title: 'What Is Dispatch?', body: 'Dispatch lets you send tasks to a Mac Cowork session from your iPhone. You type or dictate on mobile, the task routes to Cowork on your Mac, Claude executes it with full desktop access, and you get a result — even if the Mac is across the room.' },
      { type: 'concept', title: 'The Mobile → Desktop Workflow', body: 'The Dispatch workflow:\n1. Open the Claude desktop app on your Mac (Cowork mode)\n2. On iPhone, open the Claude app\n3. Dictate: "Research X and save a report to my Documents"\n4. Task queues to your Mac Cowork session\n5. Claude executes with full local access\n6. You receive a notification when done' },
      { type: 'concept', title: 'When Cowork Shines', body: 'Cowork is ideal for:\n• Organizing files and folders at scale\n• Batch-processing documents and data\n• Generating reports from local data\n• Running scripts and automations\n• Managing projects across apps\n• Anything that\'d take 20+ minutes of copy-paste work' },
    ],
    quiz: [
      { q: 'What is the main advantage of Cowork over the Claude web app?', options: ['It is faster', 'It has access to your local files and desktop apps', 'It has a better UI', 'It supports more languages'], answer: 1, explanation: 'Cowork has direct access to your local file system and desktop applications, enabling automation that the web app cannot perform.' },
      { q: 'What does Dispatch enable?', options: ['Deploying Claude to production servers', 'Sending tasks from iPhone to a Mac Cowork session', 'Dispatching emails automatically', 'Real-time collaboration with other users'], answer: 1, explanation: 'Dispatch lets you send tasks from your iPhone to a Mac Cowork session, so Claude can execute desktop tasks remotely.' },
    ],
    challenge: 'Set up a Dispatch workflow: from your iPhone, send Claude a task to organize a folder of documents on your Mac. Ask it to read all files, categorize them by type, and move them into named subfolders.',
    deepDive: 'Explore the plugin marketplace for Cowork. Install an MCP connector for a service you use daily (Slack, GitHub, Notion) and use it to automate a real recurring workflow.',
    externalLink: 'https://www.anthropic.com/claude',
  },
];

function getLevel(xp) { return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0]; }
function getNextLevel(xp) { return LEVELS.find(l => xp < l.minXP) || LEVELS[LEVELS.length - 1]; }
function getLevelProgress(xp) {
  const current = getLevel(xp);
  if (current.id === LEVELS.length) return 100;
  const next = getNextLevel(xp);
  return Math.min(100, Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100));
}

const DEFAULT_STATE = { xp: 0, completedModules: {}, quizResults: {}, badgesEarned: [], streak: 0, lastActiveDate: null, view: 'dashboard', activeModule: null, xpFloat: 0 };
let _saveTimer = null;

function loadState() {
  try { const raw = localStorage.getItem('claude_workshop_state'); return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : { ...DEFAULT_STATE }; }
  catch { return { ...DEFAULT_STATE }; }
}

function persistState(state) {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    try { const { xpFloat, ...toSave } = state; localStorage.setItem('claude_workshop_state', JSON.stringify(toSave)); }
    catch (e) { console.warn('[Workshop] Save failed:', e); }
  }, 500);
}

function checkStreak(state) {
  const today = new Date().toDateString();
  if (state.lastActiveDate === today) return state;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  return { ...state, streak: state.lastActiveDate === yesterday ? state.streak + 1 : 1, lastActiveDate: today };
}

function awardBadge(state, badgeId) {
  if (state.badgesEarned.includes(badgeId)) return state;
  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge) return state;
  return { ...state, badgesEarned: [...state.badgesEarned, badgeId], xp: state.xp + badge.xp };
}

function reducer(state, action) {
  let next;
  switch (action.type) {
    case 'SET_VIEW': return { ...state, view: action.view, activeModule: action.activeModule || null };
    case 'COMPLETE_MODULE': {
      if (state.completedModules[action.modId]) return state;
      next = { ...state, xp: state.xp + action.xp, completedModules: { ...state.completedModules, [action.modId]: true }, xpFloat: action.xp };
      if (Object.keys(next.completedModules).length === 1) next = awardBadge(next, 'first_lesson');
      if (Object.keys(next.completedModules).length === MODULES.length) next = awardBadge(next, 'completionist');
      if (action.modId === 'mod2') next = awardBadge(next, 'prompt_pro');
      if (action.modId === 'mod4') next = awardBadge(next, 'api_explorer');
      if (action.modId === 'mod5') next = awardBadge(next, 'mcp_builder');
      if (action.modId === 'mod7') next = awardBadge(next, 'agent_architect');
      if (next.streak >= 7) next = awardBadge(next, 'streak_7');
      else if (next.streak >= 3) next = awardBadge(next, 'streak_3');
      return next;
    }
    case 'QUIZ_RESULT': return { ...state, quizResults: { ...state.quizResults, [action.modId]: { score: action.score, total: action.total } } };
    case 'CLEAR_XP_FLOAT': return { ...state, xpFloat: 0 };
    case 'RESET': localStorage.removeItem('claude_workshop_state'); return { ...DEFAULT_STATE };
    default: return state;
  }
}

function XPFloat({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1400); return () => clearTimeout(t); }, [onDone]);
  return <div style={{ position:'fixed', bottom:'80px', right:'24px', zIndex:1000, background:'var(--accent-gradient)', color:'#fff', padding:'8px 18px', borderRadius:'24px', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'18px', animation:'xpFloat 1.4s ease-out forwards', pointerEvents:'none', boxShadow:'var(--shadow)' }}>+{amount} XP</div>;
}

function ProgressRing({ pct, size=56, stroke=5, color='var(--accent)' }) {
  const r = (size-stroke)/2, circ = 2*Math.PI*r;
  return <svg width={size} height={size} style={{transform:'rotate(-90deg)',display:'block'}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{transition:'stroke-dashoffset 0.7s ease'}}/>
  </svg>;
}

function CopyBtn({ text }) {
  const [copied,setCopied] = useState(false);
  return <button onClick={()=>{ navigator.clipboard.writeText(text).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1500); }); }} style={{ position:'absolute', top:'8px', right:'8px', background:copied?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.1)', border:'none', borderRadius:'6px', padding:'4px 10px', color:'var(--text)', fontSize:'11px', cursor:'pointer', fontFamily:'var(--font-mono)' }}>{copied?'✓ copied':'copy'}</button>;
}

function ModuleCard({ mod, completed, onOpen }) {
  const tc = mod.track==='Foundation'?'var(--accent)':mod.track==='Developer'?'var(--accent-secondary)':'var(--gold)';
  const [h,setH] = useState(false);
  return <div onClick={()=>onOpen(mod.id)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ background:h?'var(--surface-hover)':'var(--surface)', border:`1px solid ${completed?tc+'50':'var(--border)'}`, borderLeft:`3px solid ${completed?tc:'var(--border)'}`, borderRadius:'var(--radius)', padding:'16px', cursor:'pointer', transition:'background 0.15s' }}>
    <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
      <span style={{fontSize:'26px',lineHeight:1,marginTop:'2px',flexShrink:0}}>{mod.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
          <span style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'15px'}}>{mod.title}</span>
          {completed&&<span style={{fontSize:'12px',color:'var(--success)'}}>✓</span>}
        </div>
        <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'3px',marginBottom:'10px'}}>{mod.subtitle}</div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:'11px',background:'var(--surface-elevated)',padding:'2px 8px',borderRadius:'10px',color:'var(--text-muted)'}}>{mod.cards.length} cards</span>
          <span style={{fontSize:'11px',background:'var(--surface-elevated)',padding:'2px 8px',borderRadius:'10px',color:'var(--text-muted)'}}>{mod.quiz.length} quiz Qs</span>
          <span style={{fontSize:'11px',color:tc,fontWeight:600}}>{mod.track}</span>
        </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}><div style={{fontSize:'13px',color:'var(--text-muted)',fontWeight:600}}>+{mod.xpReward} XP</div></div>
    </div>
  </div>;
}

function Quiz({ questions, onComplete }) {
  const [idx,setIdx]=useState(0),[sel,setSel]=useState(null),[show,setShow]=useState(false),[score,setScore]=useState(0),[done,setDone]=useState(false),[fin,setFin]=useState(0);
  const q=questions[idx];
  const pick=(i)=>{ if(show)return; setSel(i); setShow(true); if(i===q.answer)setScore(s=>s+1); };
  const next=()=>{ const ns=score+(sel===q.answer?1:0); if(idx+1>=questions.length){setFin(ns);setDone(true);onComplete(ns);}else{setIdx(i=>i+1);setSel(null);setShow(false);}  };
  if(done){const pct=Math.round((fin/questions.length)*100);return <div style={{textAlign:'center',padding:'32px 16px'}}><div style={{fontSize:'52px',marginBottom:'16px'}}>{pct>=80?'🎉':'📚'}</div><div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'26px',marginBottom:'8px'}}>{fin}/{questions.length} correct</div><div style={{color:'var(--text-muted)',fontSize:'14px'}}>{pct>=80?"Excellent! You've mastered this section.":"Good effort — review the cards and try again."}</div></div>;}
  return <div>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px',fontSize:'13px',color:'var(--text-muted)'}}><span>Question {idx+1} of {questions.length}</span><span>{score} correct</span></div>
    <div style={{fontWeight:600,fontSize:'16px',marginBottom:'20px',lineHeight:1.55}}>{q.q}</div>
    <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'16px'}}>
      {q.options.map((opt,i)=>{
        let bg='var(--surface-elevated)',border='var(--border)',color='var(--text)';
        if(show){if(i===q.answer){bg='rgba(34,197,94,0.12)';border='rgba(34,197,94,0.4)';color='var(--success)';}else if(i===sel){bg='rgba(239,68,68,0.12)';border='rgba(239,68,68,0.4)';color='var(--error)';}}
        return <button key={i} onClick={()=>pick(i)} style={{textAlign:'left',padding:'13px 16px',background:bg,border:`1px solid ${border}`,borderRadius:'var(--radius)',color,fontSize:'14px',lineHeight:1.5,cursor:show?'default':'pointer',transition:'all 0.2s',fontFamily:'var(--font-body)'}}>{opt}</button>;
      })}
    </div>
    {show&&<div style={{padding:'12px 16px',background:'var(--surface)',borderRadius:'var(--radius)',fontSize:'13px',color:'var(--text-muted)',lineHeight:1.6,marginBottom:'16px',borderLeft:'3px solid var(--accent)'}}>{q.explanation}</div>}
    {show&&<button onClick={next} style={{width:'100%',padding:'13px',background:'var(--accent-gradient)',border:'none',borderRadius:'var(--radius)',color:'#fff',fontSize:'15px',fontWeight:600,cursor:'pointer'}}>{idx+1>=questions.length?'See Results':'Next Question →'}</button>}
  </div>;
}

function ModuleView({ modId, state, dispatch }) {
  const mod=MODULES.find(m=>m.id===modId),[cardIdx,setCardIdx]=useState(0),[section,setSection]=useState('cards');
  if(!mod)return null;
  const card=mod.cards[cardIdx],isComplete=!!state.completedModules[modId];
  const handleQuizComplete=(score)=>{ dispatch({type:'QUIZ_RESULT',modId,score,total:mod.quiz.length}); if(score/mod.quiz.length>=0.6&&!isComplete)dispatch({type:'COMPLETE_MODULE',modId,xp:mod.xpReward}); };
  return <div style={{maxWidth:'720px',margin:'0 auto',padding:'16px 16px 32px'}}>
    <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px'}}>
      <button onClick={()=>dispatch({type:'SET_VIEW',view:'dashboard'})} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'8px',padding:'8px 14px',color:'var(--text)',fontSize:'13px',cursor:'pointer',flexShrink:0}}>← Back</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'18px',display:'flex',alignItems:'center',gap:'8px'}}>{mod.icon} {mod.title} {isComplete&&<span style={{fontSize:'13px',color:'var(--success)'}}>✓</span>}</div>
        <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{mod.subtitle}</div>
      </div>
      <div style={{fontSize:'12px',color:'var(--text-muted)',flexShrink:0}}>+{mod.xpReward} XP</div>
    </div>
    <div style={{display:'flex',gap:'4px',marginBottom:'20px',background:'var(--surface)',padding:'4px',borderRadius:'var(--radius)'}}>
      {[['cards','📚 Cards'],['quiz','🎯 Quiz'],['challenge','🚀 Challenge']].map(([s,label])=>(
        <button key={s} onClick={()=>setSection(s)} style={{flex:1,padding:'9px 4px',borderRadius:'8px',fontSize:'13px',fontWeight:600,background:section===s?'var(--accent)':'transparent',color:section===s?'#fff':'var(--text-muted)',border:'none',cursor:'pointer',transition:'all 0.15s'}}>{label}</button>
      ))}
    </div>
    {section==='cards'&&card&&<div>
      <div style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'12px'}}>{cardIdx+1} / {mod.cards.length}</div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'24px',marginBottom:'16px',minHeight:'220px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
          <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'8px',textTransform:'uppercase',letterSpacing:'0.5px',background:card.type==='template'?'rgba(139,124,248,0.2)':'rgba(212,133,106,0.15)',color:card.type==='template'?'var(--accent-secondary)':'var(--accent)'}}>{card.type}</span>
          <span style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'16px'}}>{card.title}</span>
        </div>
        {card.type==='template'?<div style={{position:'relative'}}><pre style={{fontFamily:'var(--font-mono)',fontSize:'12px',lineHeight:1.8,color:'var(--text)',whiteSpace:'pre-wrap',wordBreak:'break-word',background:'var(--surface-elevated)',padding:'16px',borderRadius:'8px',margin:0}}>{card.body}</pre><CopyBtn text={card.body}/></div>:<div style={{fontSize:'15px',lineHeight:1.75,color:'var(--text)',whiteSpace:'pre-line'}}>{card.body}</div>}
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={()=>setCardIdx(i=>Math.max(0,i-1))} disabled={cardIdx===0} style={{flex:1,padding:'12px',borderRadius:'var(--radius)',background:'var(--surface)',border:'1px solid var(--border)',color:cardIdx===0?'var(--text-muted)':'var(--text)',cursor:cardIdx===0?'default':'pointer',fontSize:'14px',opacity:cardIdx===0?0.5:1}}>← Prev</button>
        {cardIdx<mod.cards.length-1?<button onClick={()=>setCardIdx(i=>i+1)} style={{flex:2,padding:'12px',borderRadius:'var(--radius)',background:'var(--accent-gradient)',border:'none',color:'#fff',cursor:'pointer',fontSize:'14px',fontWeight:600}}>Next →</button>:<button onClick={()=>setSection('quiz')} style={{flex:2,padding:'12px',borderRadius:'var(--radius)',background:'var(--accent-gradient)',border:'none',color:'#fff',cursor:'pointer',fontSize:'14px',fontWeight:600}}>Take Quiz 🎯</button>}
      </div>
    </div>}
    {section==='quiz'&&<div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'24px'}}><Quiz questions={mod.quiz} onComplete={handleQuizComplete}/></div>}
    {section==='challenge'&&<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border-accent)',borderRadius:'var(--radius-lg)',padding:'24px'}}><div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'16px',marginBottom:'12px'}}>🚀 Your Challenge</div><div style={{fontSize:'15px',lineHeight:1.75}}>{mod.challenge}</div></div>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'24px'}}><div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'16px',marginBottom:'12px'}}>📖 Deep Dive</div><div style={{fontSize:'15px',lineHeight:1.75,marginBottom:'16px'}}>{mod.deepDive}</div><a href={mod.externalLink} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'var(--surface-elevated)',border:'1px solid var(--border)',padding:'10px 16px',borderRadius:'var(--radius)',color:'var(--accent)',textDecoration:'none',fontSize:'14px',fontWeight:600}}>Open Docs →</a></div>
      {!isComplete?<button onClick={()=>dispatch({type:'COMPLETE_MODULE',modId,xp:mod.xpReward})} style={{width:'100%',padding:'14px',background:'var(--accent-gradient)',border:'none',borderRadius:'var(--radius)',color:'#fff',fontSize:'16px',fontWeight:700,cursor:'pointer'}}>Mark as Complete (+{mod.xpReward} XP)</button>:<div style={{textAlign:'center',color:'var(--success)',fontWeight:600,fontSize:'14px',padding:'12px'}}>✓ Module complete!</div>}
    </div>}
  </div>;
}

function ReferenceShelf() {
  const cats=['All',...new Set(COURSES.map(c=>c.category))],[active,setActive]=useState('All');
  const filtered=active==='All'?COURSES:COURSES.filter(c=>c.category===active);
  return <div style={{maxWidth:'720px',margin:'0 auto',padding:'16px 16px 32px'}}>
    <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'22px',marginBottom:'4px'}}>📚 Reference Shelf</div>
    <div style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'20px'}}>Official Anthropic documentation and resources</div>
    <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'20px'}}>{cats.map(cat=><button key={cat} onClick={()=>setActive(cat)} style={{padding:'5px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:600,background:active===cat?'var(--accent)':'var(--surface)',border:`1px solid ${active===cat?'var(--accent)':'var(--border)'}`,color:active===cat?'#fff':'var(--text-muted)',cursor:'pointer'}}>{cat}</button>)}</div>
    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>{filtered.map((c,i)=><a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'12px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'14px 16px',textDecoration:'none',color:'var(--text)',transition:'background 0.15s'}} onMouseEnter={e=>{e.currentTarget.style.background='var(--surface-hover)';e.currentTarget.style.borderColor='var(--border-accent)';}} onMouseLeave={e=>{e.currentTarget.style.background='var(--surface)';e.currentTarget.style.borderColor='var(--border)';}}>  <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:'14px',marginBottom:'2px'}}>{c.title}</div><div style={{fontSize:'11px',color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.url.replace('https://','').split('/')[0]}</div></div>  <span style={{fontSize:'10px',fontWeight:700,padding:'3px 8px',borderRadius:'8px',background:'rgba(212,133,106,0.12)',color:'var(--accent)',flexShrink:0}}>{c.category}</span>  <span style={{color:'var(--text-muted)',fontSize:'14px',flexShrink:0}}>→</span></a>)}</div>
  </div>;
}

function BadgesView({ state }) {
  return <div style={{maxWidth:'720px',margin:'0 auto',padding:'16px 16px 32px'}}>
    <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'22px',marginBottom:'4px'}}>🏆 Achievements</div>
    <div style={{color:'var(--text-muted)',fontSize:'14px',marginBottom:'24px'}}>{state.badgesEarned.length} of {BADGES.length} earned</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))',gap:'12px'}}>
      {BADGES.map(badge=>{ const earned=state.badgesEarned.includes(badge.id); return <div key={badge.id} style={{background:'var(--surface)',border:`1px solid ${earned?'rgba(212,133,106,0.4)':'var(--border)'}`,borderRadius:'var(--radius)',padding:'18px',opacity:earned?1:0.4}}><div style={{fontSize:'30px',marginBottom:'10px'}}>{badge.icon}</div><div style={{fontWeight:700,fontSize:'14px',marginBottom:'4px'}}>{badge.name}</div><div style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:1.5,marginBottom:'10px'}}>{badge.desc}</div><div style={{fontSize:'11px',fontWeight:600,color:earned?'var(--success)':'var(--text-muted)'}}>{earned?'✓ Earned':`+${badge.xp} XP`}</div></div>; })}
    </div>
  </div>;
}

function SettingsView({ state, dispatch }) {
  const level=getLevel(state.xp),progress=getLevelProgress(state.xp),nextLevel=getNextLevel(state.xp),completedCount=Object.keys(state.completedModules).length;
  return <div style={{maxWidth:'560px',margin:'0 auto',padding:'16px 16px 32px'}}>
    <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'22px',marginBottom:'24px'}}>⚙️ Profile</div>
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'24px',marginBottom:'16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'16px'}}>
        <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'var(--accent-gradient)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',flexShrink:0}}>{level.icon}</div>
        <div><div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'20px'}}>{level.name}</div><div style={{color:'var(--text-muted)',fontSize:'14px'}}>{state.xp} total XP</div></div>
      </div>
      <div style={{height:'6px',background:'var(--surface-elevated)',borderRadius:'3px',overflow:'hidden'}}><div style={{height:'100%',width:`${progress}%`,background:'var(--accent-gradient)',borderRadius:'3px',transition:'width 0.6s ease'}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',fontSize:'12px',color:'var(--text-muted)'}}><span>Level {level.id}</span><span>{level.id<LEVELS.length?`${nextLevel.minXP-state.xp} XP to ${nextLevel.name}`:'Max Level ✦'}</span></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'10px',marginBottom:'24px'}}>
      {[{label:'Modules',value:completedCount},{label:'Streak',value:`${state.streak} 🔥`},{label:'Badges',value:state.badgesEarned.length}].map(({label,value})=>(
        <div key={label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'16px',textAlign:'center'}}><div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'22px'}}>{value}</div><div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'4px'}}>{label}</div></div>
      ))}
    </div>
    <button onClick={()=>{if(window.confirm('Reset all progress? This cannot be undone.'))dispatch({type:'RESET'});}} style={{width:'100%',padding:'12px',background:'transparent',border:'1px solid var(--error)',borderRadius:'var(--radius)',color:'var(--error)',fontSize:'14px',cursor:'pointer'}}>Reset All Progress</button>
  </div>;
}

function Dashboard({ state, dispatch }) {
  const level=getLevel(state.xp),progress=getLevelProgress(state.xp),nextLevel=getNextLevel(state.xp),completedCount=Object.keys(state.completedModules).length;
  const tracks=[{name:'Foundation',emoji:'🌱',mods:MODULES.filter(m=>m.track==='Foundation')},{name:'Developer',emoji:'⚡',mods:MODULES.filter(m=>m.track==='Developer')},{name:'Bonus',emoji:'🚀',mods:MODULES.filter(m=>m.track==='Bonus')}];
  return <div style={{maxWidth:'720px',margin:'0 auto',padding:'16px 16px 32px'}}>
    <div style={{background:'linear-gradient(135deg, var(--surface), var(--surface-elevated))',border:'1px solid var(--border)',borderRadius:'var(--radius-xl)',padding:'24px',marginBottom:'28px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
        <div style={{position:'relative',flexShrink:0}}>
          <ProgressRing pct={progress} size={68} stroke={6}/>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px'}}>{level.icon}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'20px'}}>{level.name}</div>
          <div style={{color:'var(--text-muted)',fontSize:'13px',marginTop:'2px'}}>{state.xp} XP · {completedCount}/{MODULES.length} modules</div>
          {state.streak>0&&<div style={{fontSize:'13px',color:'var(--gold)',marginTop:'4px',fontWeight:600}}>🔥 {state.streak}-day streak</div>}
        </div>
        <div style={{textAlign:'right',flexShrink:0}}><div style={{fontSize:'11px',color:'var(--text-muted)'}}>Next level</div><div style={{fontWeight:700,fontSize:'14px',marginTop:'2px'}}>{level.id<LEVELS.length?nextLevel.name:'✦ Max'}</div></div>
      </div>
    </div>
    {tracks.map(track=><div key={track.name} style={{marginBottom:'28px'}}>
      <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'15px',marginBottom:'12px',color:'var(--text-muted)',display:'flex',alignItems:'center',gap:'8px'}}>{track.emoji} {track.name} Track</div>
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>{track.mods.map(mod=><ModuleCard key={mod.id} mod={mod} completed={!!state.completedModules[mod.id]} onOpen={(id)=>dispatch({type:'SET_VIEW',view:'module',activeModule:id})}/>)}</div>
    </div>)}
  </div>;
}

function Sidebar({ state, dispatch, collapsed }) {
  const level=getLevel(state.xp),progress=getLevelProgress(state.xp);
  const NAV=[{id:'dashboard',icon:'🏠',label:'Dashboard'},{id:'reference',icon:'📚',label:'Reference'},{id:'badges',icon:'🏆',label:'Badges'},{id:'settings',icon:'⚙️',label:'Profile'}];
  return <div style={{width:collapsed?'64px':'240px',height:'100%',flexShrink:0,background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',transition:'width 0.25s ease',overflow:'hidden'}}>
    <div style={{padding:collapsed?'18px 0':'20px 16px',borderBottom:'1px solid var(--border)',textAlign:collapsed?'center':'left'}}>
      <div style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:collapsed?'22px':'20px'}}>{collapsed?'✦':'✦ Claude'}</div>
      {!collapsed&&<div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'2px'}}>Mastery Workshop</div>}
    </div>
    {!collapsed&&<div style={{padding:'12px 16px',borderBottom:'1px solid var(--border)'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}><span style={{fontSize:'18px'}}>{level.icon}</span><div><div style={{fontWeight:600,fontSize:'13px'}}>{level.name}</div><div style={{fontSize:'11px',color:'var(--text-muted)'}}>{state.xp} XP</div></div></div>
      <div style={{height:'4px',background:'var(--surface-elevated)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',width:`${progress}%`,background:'var(--accent-gradient)',borderRadius:'2px',transition:'width 0.6s ease'}}/></div>
    </div>}
    <nav style={{flex:1,padding:'8px'}}>{NAV.map(item=>{ const active=state.view===item.id; return <button key={item.id} onClick={()=>dispatch({type:'SET_VIEW',view:item.id})} style={{display:'flex',alignItems:'center',gap:'10px',width:'100%',padding:collapsed?'12px 0':'10px 12px',justifyContent:collapsed?'center':'flex-start',borderRadius:'var(--radius)',marginBottom:'2px',background:active?'rgba(212,133,106,0.14)':'transparent',color:active?'var(--accent)':'var(--text-muted)',fontWeight:active?600:400,fontSize:'14px',border:'none',cursor:'pointer',transition:'all 0.15s',WebkitTapHighlightColor:'transparent'}} onMouseEnter={e=>{if(!active)e.currentTarget.style.background='var(--surface-hover)';}} onMouseLeave={e=>{if(!active)e.currentTarget.style.background='transparent';}}><span style={{fontSize:'18px',lineHeight:1}}>{item.icon}</span>{!collapsed&&<span>{item.label}</span>}</button>; })}</nav>
    {!collapsed&&state.streak>0&&<div style={{padding:'12px 16px',borderTop:'1px solid var(--border)',fontSize:'13px',color:'var(--gold)'}}>🔥 {state.streak}-day streak</div>}
  </div>;
}

function BottomNav({ state, dispatch }) {
  const NAV=[{id:'dashboard',icon:'🏠',label:'Learn'},{id:'reference',icon:'📚',label:'Reference'},{id:'badges',icon:'🏆',label:'Badges'},{id:'settings',icon:'⚙️',label:'Profile'}];
  return <div style={{position:'fixed',bottom:0,left:0,right:0,background:'var(--surface)',borderTop:'1px solid var(--border)',display:'flex',alignItems:'flex-start',padding:'0 8px',paddingBottom:'env(safe-area-inset-bottom)',zIndex:100,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',minHeight:'calc(64px + env(safe-area-inset-bottom))'}}>
    {NAV.map(item=>{ const active=state.view===item.id; return <button key={item.id} onClick={()=>dispatch({type:'SET_VIEW',view:item.id})} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'10px 0 8px',border:'none',background:'none',color:active?'var(--accent)':'var(--text-muted)',cursor:'pointer',fontSize:'10px',fontWeight:active?700:400,transition:'color 0.15s',WebkitTapHighlightColor:'transparent'}}><span style={{fontSize:'22px',lineHeight:1,marginBottom:'3px',transform:active?'scale(1.1)':'scale(1)',transition:'transform 0.15s',display:'block'}}>{item.icon}</span>{item.label}</button>; })}
  </div>;
}

function App() {
  const [state,dispatch]=useReducer(reducer,null,()=>checkStreak(loadState()));
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  const [isTablet,setIsTablet]=useState(window.innerWidth>=768&&window.innerWidth<1024);
  useEffect(()=>{persistState(state);},[state]);
  useEffect(()=>{
    const update=()=>{const w=window.innerWidth;setIsMobile(w<768);setIsTablet(w>=768&&w<1024);};
    window.addEventListener('resize',update);
    window.addEventListener('orientationchange',()=>setTimeout(update,150));
    return()=>{window.removeEventListener('resize',update);};
  },[]);
  useEffect(()=>{ const p=new URLSearchParams(window.location.search); if(p.get('view')==='reference')dispatch({type:'SET_VIEW',view:'reference'}); },[]);
  useEffect(()=>{ const el=document.getElementById('loading'); if(el){el.style.opacity='0';el.style.transition='opacity 0.4s ease';setTimeout(()=>{if(el)el.style.display='none';},400);} },[]);
  let content;
  if(state.view==='module'&&state.activeModule)content=<ModuleView modId={state.activeModule} state={state} dispatch={dispatch}/>;
  else if(state.view==='reference')content=<ReferenceShelf/>;
  else if(state.view==='badges')content=<BadgesView state={state}/>;
  else if(state.view==='settings')content=<SettingsView state={state} dispatch={dispatch}/>;
  else content=<Dashboard state={state} dispatch={dispatch}/>;
  return <>
    <style>{`@keyframes xpFloat{0%{opacity:1;transform:translateY(0) scale(1);}20%{opacity:1;transform:translateY(-8px) scale(1.05);}100%{opacity:0;transform:translateY(-56px) scale(0.9);}}@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}`}</style>
    {state.xpFloat>0&&<XPFloat amount={state.xpFloat} onDone={()=>dispatch({type:'CLEAR_XP_FLOAT'})}/>}
    <div style={{display:'flex',height:'100%',overflow:'hidden'}}>
      {!isMobile&&<Sidebar state={state} dispatch={dispatch} collapsed={isTablet}/>}
      <div style={{flex:1,overflowY:'auto',paddingTop:'env(safe-area-inset-top)',paddingBottom:isMobile?'calc(64px + env(safe-area-inset-bottom))':'0',WebkitOverflowScrolling:'touch'}}>
        <div style={{animation:'fadeIn 0.25s ease',minHeight:'100%'}}>{content}</div>
      </div>
    </div>
    {isMobile&&<BottomNav state={state} dispatch={dispatch}/>}
  </>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
