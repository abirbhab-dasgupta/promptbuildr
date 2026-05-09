"use client";

import { usePromptStore } from "@/store/usePromptStore";

const MAX_CHARS = 1000;

const placeholders: Record<string, string> = {
    code: "e.g. Build a REST API in Node.js that handles user authentication with JWT tokens and refresh logic...",
    image: "e.g. A futuristic city at night with neon lights reflecting on wet streets, cyberpunk aesthetic...",
    writing: "e.g. Write a blog post about why junior developers should contribute to open source projects...",
    agent: "e.g. An AI agent that monitors my GitHub repo and auto-creates issues when tests fail...",
    study: "e.g. Explain how transformer architecture works in deep learning with simple analogies...",
    general: "e.g. Help me plan a 30-day learning roadmap for becoming a full-stack developer...",
};

export default function IdeaInput() {
    const { idea, setIdea, mode } = usePromptStore();
    const remaining = MAX_CHARS - idea.length;
    const isNearLimit = remaining < 100;

    return (
        <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
                <span className="block font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-60">
                    Your Raw Idea
                </span>
                <span
                    className={`font-mono-custom text-[10px] transition-colors ${isNearLimit ? "text-sienna font-bold" : "text-brown-mid opacity-40"
                        }`}
                >
                    {remaining} / {MAX_CHARS}
                </span>
            </div>

            <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder={placeholders[mode] ?? placeholders.general}
                rows={7}
                className="
          w-full
          bg-brown text-cream-dark
          border-brutal
          p-4
          font-mono-custom text-[13px] leading-relaxed
          placeholder:text-brown-light placeholder:opacity-50 placeholder:italic
          resize-y
          outline-none
          focus:shadow-[inset_0_0_0_2px_#edd9a3]
          transition-shadow duration-100
          caret-cream-dark
        "
            />
        </div>
    );
}