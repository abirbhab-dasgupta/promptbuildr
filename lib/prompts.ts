import { Mode, Model, Tone } from "@/types";

// ── TONE DESCRIPTORS ──────────────────────────────────────
const toneDescriptors: Record<Tone, string> = {
  professional: "formal, precise, and authoritative",
  casual: "friendly, conversational, and approachable",
  technical: "detailed, accurate, and jargon-rich",
  creative: "imaginative, expressive, and original",
};

// ── MODE CONTEXT ──────────────────────────────────────────
const modeContext: Record<Mode, string> = {
  code: "software development, programming, and engineering tasks",
  image: "visual art, design, and image generation",
  writing: "content creation, copywriting, and storytelling",
  agent: "AI agents, automation workflows, and agentic systems",
  study: "learning, research, academic understanding, and teaching",
  general: "general-purpose tasks and open-ended questions",
};

// ── SHARED INSTRUCTIONS ───────────────────────────────────
const sharedRules = `
CRITICAL OUTPUT RULES — READ CAREFULLY:
1. You must respond with ONLY a raw JSON object. Nothing before it. Nothing after it.
2. No markdown. No code fences. No backticks. No explanation.
3. The JSON must start with { and end with }
4. The "prompt" field must contain ONLY clean, plain English text.
5. The "prompt" field must NOT contain any XML tags, JSON, code blocks, or special formatting.
6. The "prompt" field must be minimum 150 words of pure readable instructions.
7. The "explanations" array must contain exactly 3 strings.

VALID response format:
{"prompt":"You are a...","explanations":["reason 1","reason 2","reason 3"]}
`;

// ── CHATGPT ───────────────────────────────────────────────
function buildChatGPTPrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer specialized in ChatGPT/GPT-4o.

Transform this raw idea into a powerful ChatGPT prompt using the CRAFT framework:
- Context: Set the scene and background clearly
- Role: Assign ChatGPT a specific expert role
- Action: One clear, direct verb-driven instruction  
- Format: Specify exact output structure
- Tone: ${toneDescriptors[tone]}

Mode: ${modeContext[mode]}

Rules for the generated prompt:
- Open with "You are a [specific expert]..."
- Include numbered steps for complex tasks
- Specify output length and format explicitly
- Add "Think step by step before responding" for reasoning tasks
- Include quality criteria and constraints
- Minimum 150 words

${sharedRules}

Raw idea: "${idea}"`;
}

// ── CLAUDE ────────────────────────────────────────────────
function buildClaudePrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer specialized in Anthropic Claude.

Transform this raw idea into a powerful Claude prompt.

Rules for the generated prompt text:
- Open with "You are a [specific expert]..."
- Use clear section headers like ROLE:, TASK:, CONTEXT:, INSTRUCTIONS:, FORMAT:
- Use plain English with numbered steps — NO XML tags in the output
- Include detailed instructions with specific requirements
- Add "Think carefully step by step before responding"
- Specify output format clearly with examples
- Include edge cases and quality criteria
- Tone to apply: ${toneDescriptors[tone]}
- Mode: ${modeContext[mode]}
- Minimum 150 words

${sharedRules}

Raw idea: "${idea}"`;
}

// ── GEMINI ────────────────────────────────────────────────
function buildGeminiPrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer specialized in Google Gemini.

Transform this raw idea into a powerful Gemini prompt using the PTCF framework:
- Persona: Define Gemini's role clearly
- Task: One clear sentence stating the objective
- Context: Background details and constraints
- Format: Exact output structure required

Rules for the generated prompt text:
- Open with a clear persona definition
- Keep the core task instruction direct and unambiguous
- Include numbered steps for multi-part tasks
- Specify output format explicitly (bullet list, numbered list, table, etc.)
- Add a constraints section with what to avoid
- Tone: ${toneDescriptors[tone]}
- Mode: ${modeContext[mode]}
- Minimum 150 words

${sharedRules}

Raw idea: "${idea}"`;
}

// ── MIDJOURNEY ────────────────────────────────────────────
function buildMidjourneyPrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert Midjourney V7 prompt engineer.

Transform this raw idea into a rich Midjourney V7 image prompt.

The generated prompt must follow this structure (comma-separated keywords, NOT sentences):
Subject, medium, environment, lighting, color palette, mood, style references, --ar ratio --s value --v 7

Rules for the generated prompt:
- Use 15 to 25 specific comma-separated visual descriptors
- Put the most important element first
- Be hyper-specific: "elderly fisherman with weathered hands" not "a man"
- Include at least 3 artist or style references
- Add camera specs if photographic (e.g. 85mm lens, f/1.4 aperture)
- End with parameters: --ar 16:9 --s 300 --v 7
- Use --no for exclusions at the end
- Mood: ${toneDescriptors[tone]}
- Mode: ${modeContext[mode]}

${sharedRules}

Raw idea: "${idea}"`;
}

// ── MAIN BUILDER ──────────────────────────────────────────
export function buildPrompt(
  idea: string,
  mode: Mode,
  model: Model,
  tone: Tone
): string {
  switch (model) {
    case "chatgpt": return buildChatGPTPrompt(idea, mode, tone);
    case "claude": return buildClaudePrompt(idea, mode, tone);
    case "gemini": return buildGeminiPrompt(idea, mode, tone);
    case "midjourney": return buildMidjourneyPrompt(idea, mode, tone);
    default: return buildChatGPTPrompt(idea, mode, tone);
  }
}