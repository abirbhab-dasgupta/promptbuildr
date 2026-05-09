export type Mode =
    | "code"
    | "image"
    | "writing"
    | "agent"
    | "study"
    | "general";

export type Model =
    | "chatgpt"
    | "claude"
    | "gemini"
    | "midjourney";

export type Tone =
    | "professional"
    | "casual"
    | "technical"
    | "creative";

export interface PromptRequest {
    idea: string;
    mode: Mode;
    model: Model;
    tone: Tone;
}

export interface PromptResponse {
    prompt: string;
    explanations: string[];
}

export interface HistoryItem {
    id: number;
    idea: string;
    prompt: string;
    explanations: string[];
    mode: Mode;
    model: Model;
    tone: Tone;
    date: string;
}