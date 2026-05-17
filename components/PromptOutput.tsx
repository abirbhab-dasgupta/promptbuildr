"use client";

import { useState } from "react";
import { Copy, Check, Save, RotateCcw } from "lucide-react";
import { usePromptStore } from "@/store/usePromptStore";
import { useHistory } from "@/hooks/useHistory";
import ExplainBlock from "./ExplainBlock";

// ── PROMPT RENDERER ─────────────────────────────────────────────────────────
// Parses the prompt string into labelled sections and renders them
// as styled blocks matching the brutalist design system.

type Section = {
    label: string | null;
    body: string;
};

// Known section labels across all model prompt formats
const SECTION_LABELS = [
    "Persona",
    "Output Format",
    "Task",
    "Context",
    "Constraints",
    "Grounding",
    "Role",
    "Instructions",
    "Format",
    "Tone",
    "Domain",
    "Note",
];

function parsePrompt(raw: string): Section[] {
    const lines = raw.split("\n");
    const sections: Section[] = [];
    let currentLabel: string | null = null;
    let currentLines: string[] = [];

    function flush() {
        const body = currentLines.join("\n").trim();
        if (body) sections.push({ label: currentLabel, body });
        currentLines = [];
    }

    for (const line of lines) {
        // Detect "Label: content" at start of a line
        const match = line.match(
            new RegExp(`^(${SECTION_LABELS.join("|")}):\\s*(.*)$`, "i")
        );

        if (match) {
            flush();
            currentLabel = match[1];
            if (match[2].trim()) currentLines.push(match[2].trim());
        } else {
            currentLines.push(line);
        }
    }

    flush();
    return sections;
}

function PromptRenderer({ prompt }: { prompt: string }) {
    const sections = parsePrompt(prompt);
    const isStructured = sections.some((s) => s.label !== null);

    // ── Unstructured (Midjourney / plain) — render as-is but styled ──
    if (!isStructured) {
        return (
            <p className="font-mono-custom text-[12px] leading-relaxed text-cream whitespace-pre-wrap wrap-break-word">
                {prompt}
            </p>
        );
    }

    // ── Structured (ChatGPT / Claude / Gemini) — render sections ──
    return (
        <div className="flex flex-col gap-3">
            {sections.map((section, i) => {
                if (!section.label) {
                    // Opening command line (e.g. "Generate a...")
                    return (
                        <p
                            key={i}
                            className="font-mono-custom text-[13px] leading-relaxed text-cream font-bold whitespace-pre-wrap wrap-break-word"
                        >
                            {section.body}
                        </p>
                    );
                }

                // Numbered list detection inside a section body
                const bodyLines = section.body.split("\n");
                const hasNumberedItems = bodyLines.some((l) => /^\d+\./.test(l.trim()));

                return (
                    <div key={i} className="border-l-[3px] border-cream-dark pl-3">
                        {/* Section label */}
                        <span className="font-mono-custom text-[9px] uppercase tracking-[2px] text-cream opacity-40 block mb-1">
                            {section.label}
                        </span>

                        {/* Section body */}
                        {hasNumberedItems ? (
                            <ol className="flex flex-col gap-1">
                                {bodyLines.map((line, j) => {
                                    const numMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
                                    if (numMatch) {
                                        return (
                                            <li key={j} className="flex gap-2">
                                                <span className="font-mono-custom text-[10px] text-cream opacity-40 shrink-0 w-4">
                                                    {numMatch[1]}.
                                                </span>
                                                <span className="font-mono-custom text-[12px] leading-relaxed text-cream">
                                                    {numMatch[2]}
                                                </span>
                                            </li>
                                        );
                                    }
                                    return line.trim() ? (
                                        <li key={j}>
                                            <span className="font-mono-custom text-[12px] leading-relaxed text-cream">
                                                {line}
                                            </span>
                                        </li>
                                    ) : null;
                                })}
                            </ol>
                        ) : (
                            <p className="font-mono-custom text-[12px] leading-relaxed text-cream whitespace-pre-wrap wrap-break-word">
                                {section.body}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PromptOutput() {
    const { response, isLoading, error, mode, model, tone, idea, setResponse } =
        usePromptStore();
    const { save } = useHistory();
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    async function handleCopy() {
        if (!response?.prompt) return;
        try {
            await navigator.clipboard.writeText(response.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Copy failed");
        }
    }

    function handleSave() {
        if (!response) return;
        save({ idea, mode, model, tone, response });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    function handleReset() {
        setResponse(null);
    }

    // ── LOADING STATE ──────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-8">
                <div className="loader-track w-full">
                    <div className="loader-bar" />
                </div>
                <span className="font-mono-custom text-[11px] uppercase tracking-[2px] text-brown-mid animate-pulse">
                    Forging your prompt...
                </span>
            </div>
        );
    }

    // ── ERROR STATE ────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-8">
                <div className="border-brutal bg-cream-mid w-full p-6 text-center shadow-brutal">
                    <p className="font-mono-custom text-[11px] uppercase tracking-[2px] text-sienna font-bold mb-2">
                        Something went wrong
                    </p>
                    <p className="font-mono-custom text-[11px] text-ink opacity-60">
                        {error}
                    </p>
                    <button
                        onClick={handleReset}
                        className="mt-4 flex items-center gap-2 mx-auto font-mono-custom text-[10px] uppercase tracking-[1px] bg-cream border-brutal-2 px-4 py-2 shadow-brutal-sm shadow-brutal-hover"
                    >
                        <RotateCcw size={12} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ── EMPTY STATE ────────────────────────────────────────────
    if (!response) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-3 p-8 border-[3px] border-dashed border-brown-light m-4">
                <p className="font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-50 text-center leading-relaxed">
                    Your powerful prompt
                    <br />
                    will appear here.
                    <br />
                    <br />
                    Fill your idea
                    <br />
                    Hit Generate.
                </p>
            </div>
        );
    }

    // ── OUTPUT STATE ───────────────────────────────────────────
    return (
        <div className="flex flex-col h-full">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin max-h-[600px]">
                {/* Meta tags */}
                <div className="flex gap-2 flex-wrap p-4 pb-0">
                    {[model, mode, tone].map((tag) => (
                        <span
                            key={tag}
                            className="font-mono-custom text-[9px] uppercase tracking-[1px] bg-brown text-cream px-2 py-1 border-brutal-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Prompt box */}
                <div className="m-4 border-brutal bg-brown shadow-brutal">
                    <div className="px-4 pt-3 pb-1 border-b-2px border-brown-mid">
                        <span className="font-mono-custom text-[9px] uppercase tracking-[2px] text-cream-dark opacity-50">
              // Generated Prompt — Copy & Use
                        </span>
                    </div>
                    <div className="p-4">
                        <PromptRenderer prompt={response.prompt} />
                    </div>
                </div>

                {/* Explain block */}
                <div className="mx-4 mb-4">
                    <ExplainBlock explanations={response.explanations} />
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-auto border-t-[3px] border-ink border-b-[3px] border-b-ink">
                <div className="grid grid-cols-3">
                    <button
                        onClick={handleCopy}
                        className={`
              flex items-center justify-center gap-2
              py-[21px] border-r-[3px] border-ink
              font-mono-custom text-[10px] uppercase tracking-[1px]
              transition-all duration-100 cursor-pointer
              ${copied
                                ? "bg-green text-cream"
                                : "bg-cream text-ink hover:bg-brown hover:text-cream"
                            }
            `}
                    >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    <button
                        onClick={handleSave}
                        className={`
              flex items-center justify-center gap-2
              py-[21px] border-r-[3px] border-ink
              font-mono-custom text-[10px] uppercase tracking-[1px]
              transition-all duration-100 cursor-pointer
              ${saved
                                ? "bg-green text-cream"
                                : "bg-cream text-ink hover:bg-brown hover:text-cream"
                            }
            `}
                    >
                        <Save size={13} />
                        {saved ? "Saved" : "Save"}
                    </button>

                    <button
                        onClick={handleReset}
                        className="
              flex items-center justify-center gap-2
              py-[21px]
              font-mono-custom text-[10px] uppercase tracking-[1px]
              bg-cream text-ink
              hover:bg-brown hover:text-cream
              transition-all duration-100 cursor-pointer
            "
                    >
                        <RotateCcw size={13} />
                        Reset
                    </button>
                </div>
                <p className="text-center font-mono-custom text-[9px] uppercase tracking-[1px] text-brown-mid opacity-40 py-2">
                    your prompt is never stored on our servers
                </p>
            </div>
        </div>
    );
}