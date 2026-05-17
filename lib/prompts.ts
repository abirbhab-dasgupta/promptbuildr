import { Mode, Model, Tone } from "@/types";

const toneMap: Record<Tone, string> = {
  professional: "formal, authoritative, and precise — no filler, no slang",
  casual: "warm, conversational, and direct — like a knowledgeable friend",
  technical: "expert-level, jargon-aware, assumption-heavy — skip the basics",
  creative: "imaginative, evocative, lateral — push boundaries and surprise",
};

const modeMap: Record<Mode, string> = {
  code: "software engineering, programming, debugging, architecture",
  image: "visual art direction, image generation, design aesthetics",
  writing: "content creation, copywriting, storytelling, editing",
  agent: "AI agents, automation pipelines, multi-step agentic workflows",
  study: "learning, tutoring, research, academic understanding",
  general: "open-ended tasks, Q&A, analysis, general productivity",
};

// ─────────────────────────────────────────────────────────────────────────────
// OUTPUT CONTRACTS
// Two versions: one for plain-text models (ChatGPT, Gemini, Midjourney)
// and one for Claude which legitimately uses XML tags inside the prompt field.
// They MUST be separate — telling Gemini "no XML tags" while also asking it
// to generate XML tags causes it to output {"prompt":""}.
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUT_CONTRACT_PLAIN = `
===== ABSOLUTE OUTPUT RULES =====

Your entire response must be ONE raw JSON object and nothing else.
Nothing before the opening brace. Nothing after the closing brace.
No markdown code fences. No backticks. No triple backticks anywhere.

Inside every JSON field value you must NEVER use:
  asterisks (*) for any purpose
  markdown bold (**text**) or italic (*text*)
  dash bullet characters used as list markers
  code blocks or backticks of any kind

The JSON must have exactly two fields:

"prompt" — a string of plain English text only, minimum 200 words.
  Must open with a direct command verb: Generate, Create, Write, Build, Analyze, etc.
  Must be the actual instruction the user pastes into the AI tool.
  Must NOT be an artistic brief or a meta-description of what a prompt should contain.

"explanations" — an array of exactly 3 plain-English strings, one sentence each.

Start your response with { and end with }. Nothing else.
`;

// For Claude: XML tags are explicitly allowed inside the prompt field value.
// Do NOT add any rule banning XML here — the Claude prompt requires them.
const OUTPUT_CONTRACT_CLAUDE = `
===== ABSOLUTE OUTPUT RULES =====

Your entire response must be ONE raw JSON object and nothing else.
Nothing before the opening brace. Nothing after the closing brace.
No markdown code fences. No backticks. No triple backticks anywhere.

The JSON must have exactly two fields:

"prompt" — a string containing the Claude prompt with XML tags for structure.
  Must open with a direct command verb: Generate, Create, Write, Build, Analyze, etc.
  Must use XML tags (role, task, instructions, constraints, output_format) for sections.
  Must be minimum 200 words.
  Must NOT use asterisks (*), markdown bold (**text**), or backticks inside the XML content.
  Must NOT use the tag names: thinking, answer, think — these break JSON parsing.
  All XML tags must be properly opened and closed.

"explanations" — an array of exactly 3 plain-English strings, one sentence each.

CRITICAL FOR JSON VALIDITY:
The prompt string will contain XML tags like <role>, <task>, etc.
These are valid inside a JSON string value. Do not escape them differently.
Do not add any extra characters outside the opening { and closing }.

Start your response with { and end with }. Nothing else.
`;

// ─────────────────────────────────────────────────────────────────────────────
// GPT-5.5
// ─────────────────────────────────────────────────────────────────────────────
function buildChatGPTPrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer for GPT-5.5 (ChatGPT default, May 2026).

Transform the raw idea below into a prompt the user pastes directly into ChatGPT.

THE GENERATED PROMPT MUST:
- Open with a direct command verb: Generate, Create, Write, Analyze, or Build
- Tell GPT-5.5 exactly what to produce, in what format, to what standard
- Be the actual instruction sent to GPT-5.5, not a description of what a good prompt looks like

GPT-5.5 PROMPTING PRINCIPLES:
GPT-5.5 is outcome-first: define what a perfect result looks like, let the model plan the path.
It is instruction-literal and reliably follows negative constraints.
Role assignment at the start primes domain expertise effectively.
Format declarations placed early are followed reliably.

STRUCTURE FOR THE GENERATED PROMPT (plain English paragraphs, no XML):
Line 1: Direct command verb + exactly what to create.
Paragraph 2: Specific expert role for GPT-5.5 to adopt.
Paragraph 3: What a perfect output looks like — format, length, structure, quality bar.
Paragraph 4: Explicit constraints — what to avoid, what not to assume.
Final line: Tone — ${toneMap[tone]}.

Domain: ${modeMap[mode]}.

${OUTPUT_CONTRACT_PLAIN}

Raw idea: "${idea}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUDE — uses XML tags inside prompt field (separate output contract)
// ─────────────────────────────────────────────────────────────────────────────
function buildClaudePrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer for Anthropic Claude (Opus 4.6 and Sonnet 4.6, May 2026).

Transform the raw idea below into a prompt the user pastes directly into Claude.

THE GENERATED PROMPT MUST:
- Open with a direct command verb: Generate, Create, Write, Analyze, or Build
- Use XML tags for every section — Claude was trained on XML structure
- Be the actual instruction sent to Claude, not a meta-description

CLAUDE PROMPTING PRINCIPLES:
Claude was specifically trained to parse XML tags — they dramatically improve accuracy.
Claude 4.x is instruction-literal: every requirement must be stated explicitly.
Numbered steps inside an instructions tag improve accuracy significantly.
Never use markdown headers — use XML tags instead.

STRUCTURE FOR THE GENERATED PROMPT:
First line: Direct command verb stating exactly what Claude should produce.
Then these XML sections in order:
  <role> — specific expert identity, not generic
  <task> — single clear objective in one sentence
  <instructions> — numbered steps, one per line, ending with: Reason carefully through each requirement before writing your final answer.
  <constraints> — what to avoid and what quality bar to meet
  <output_format> — exact structure, length, and style of the answer

FORBIDDEN TAG NAMES — never use these inside the generated prompt:
thinking, answer, think
These tag names cause the model to emit internal reasoning blocks which break JSON parsing.
Use only: role, task, instructions, constraints, output_format

Tone to apply inside the prompt: ${toneMap[tone]}.
Domain: ${modeMap[mode]}.

${OUTPUT_CONTRACT_CLAUDE}

Raw idea: "${idea}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI
// ─────────────────────────────────────────────────────────────────────────────
function buildGeminiPrompt(idea: string, mode: Mode, tone: Tone): string {
  return `You are PromptSmith, an expert prompt engineer for Google Gemini (2.5 Flash and 2.5 Pro, May 2026).

Transform the raw idea below into a prompt the user pastes directly into Gemini.

THE GENERATED PROMPT MUST:
- Open with a direct command verb: Generate, Create, Write, Analyze, or Summarize
- Tell Gemini exactly what to produce, in what format, to what quality
- Be the actual instruction sent to Gemini, not a meta-description

GEMINI PROMPTING PRINCIPLES:
Gemini 2.5 models are thinking models — they reason before responding.
Gemini responds best to colon-labeled sections: Persona:, Task:, Output Format:, Context:, Constraints:
Output format declared early in the prompt is followed reliably.
Move from broad to specific: persona first, output format second, task third, context last.

STRUCTURE FOR THE GENERATED PROMPT (colon-labeled sections, no XML):
Line 1: Direct command verb + exactly what to create.
Persona: specific expert role with domain and seniority level
Output Format: exact structure and length — place this high
Task: one sentence starting with a strong verb
Context: background, audience, relevant constraints
Constraints: at least 3 explicit rules written as complete sentences
Grounding (for factual tasks): instruct Gemini to flag uncertainty rather than guess

Tone: ${toneMap[tone]}.
Domain: ${modeMap[mode]}.

${OUTPUT_CONTRACT_PLAIN}

Raw idea: "${idea}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MIDJOURNEY V7
// ─────────────────────────────────────────────────────────────────────────────
function buildMidjourneyPrompt(idea: string, mode: Mode, tone: Tone): string {
  const moodByTone: Record<Tone, string> = {
    professional: "clean polished refined minimal sharp high fidelity",
    casual: "warm relaxed natural soft golden hour candid inviting",
    technical: "precise structured clinical detail-rich blueprint-accurate",
    creative: "surreal dreamlike vibrant dynamic otherworldly imaginative",
  };

  const arByMode: Record<Mode, string> = {
    image: "--ar 16:9",
    writing: "--ar 16:9",
    code: "--ar 16:9",
    agent: "--ar 16:9",
    study: "--ar 4:3",
    general: "--ar 16:9",
  };

  return `You are PromptSmith, a Midjourney V7 expert (V7 is the current default as of 2026).

Transform the raw idea below into a Midjourney V7 image prompt.

THE GENERATED PROMPT IS NOT A PARAGRAPH OR A BRIEF.
It is a single line of comma-separated visual keywords pasted after /imagine in Midjourney.
Midjourney is a diffusion model — it reads visual keywords, not sentences or instructions.

CORRECT format:
"solitary polar bear on fractured arctic ice at twilight, aurora borealis reflection, dramatic low angle, cold blue violet palette, cinematic fog, hyperrealistic, in the style of Art Wolfe and Paul Nicklen, Sony A1 85mm f1.4, --ar 16:9 --s 250 --v 7 --chaos 15 --no text watermark blurry"

WRONG — never produce sentences or instructions:
"You are a concept artist..." or "Generate an image that conveys..." or "The image should evoke..."

V7 STRUCTURE (one line, comma-separated):
[Hyper-specific subject] [secondary elements] [environment] [time of day] [lighting quality and direction] [color palette] [mood keywords] [artistic medium or style] [2+ named artist references] [camera specs if photorealistic] [parameters]

RULES:
Be hyper-specific: not "a bear" but "massive solitary polar bear with amber eyes and battle-scarred fur"
Include at least 2 named artist or photographer references
For photorealistic: camera body, lens mm, aperture. For artwork: medium and texture.
Lighting must be fully described with direction and quality.
Mood keywords: ${moodByTone[tone]}
End with: ${arByMode[mode]} --s 250 --v 7 --chaos 15 --no text watermark blurry low quality

Domain: ${modeMap[mode]}

${OUTPUT_CONTRACT_PLAIN}

FINAL CHECK: Is the prompt field a single line of comma-separated visual keywords ending in --v 7 parameters?
If it contains sentences or starts with "You are" or "Generate" — rewrite as visual keywords only.

Raw idea: "${idea}"`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function buildPrompt(
  idea: string,
  mode: Mode,
  model: Model,
  tone: Tone
): string {
  switch (model) {
    case "chatgpt":
      return buildChatGPTPrompt(idea, mode, tone);
    case "claude":
      return buildClaudePrompt(idea, mode, tone);
    case "gemini":
      return buildGeminiPrompt(idea, mode, tone);
    case "midjourney":
      return buildMidjourneyPrompt(idea, mode, tone);
    default:
      return buildChatGPTPrompt(idea, mode, tone);
  }
}