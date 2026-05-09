"use client";

import {
    Code2,
    Image,
    PenLine,
    Bot,
    BookOpen,
    Sparkles,
} from "lucide-react";
import { Mode } from "@/types";
import { usePromptStore } from "@/store/usePromptStore";

const modes: { value: Mode; label: string; icon: React.ReactNode }[] = [
    { value: "code", label: "Code", icon: <Code2 size={18} strokeWidth={2} /> },
    { value: "image", label: "Image", icon: <Image size={18} strokeWidth={2} /> },
    { value: "writing", label: "Writing", icon: <PenLine size={18} strokeWidth={2} /> },
    { value: "agent", label: "Agent", icon: <Bot size={18} strokeWidth={2} /> },
    { value: "study", label: "Study", icon: <BookOpen size={18} strokeWidth={2} /> },
    { value: "general", label: "General", icon: <Sparkles size={18} strokeWidth={2} /> },
];

export default function ModeSelector() {
    const { mode, setMode } = usePromptStore();

    return (
        <div className="mb-5">
            <span className="block font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-60 mb-2">
                Prompt Mode
            </span>

            <div className="grid grid-cols-3 border-brutal">
                {modes.map((m, i) => {
                    const isActive = mode === m.value;
                    const isLastRow = i >= 3;
                    const isRightEdge = (i + 1) % 3 === 0;

                    return (
                        <button
                            key={m.value}
                            onClick={() => setMode(m.value)}
                            className={`
                flex flex-col items-center justify-center gap-1.5
                py-3 px-2
                font-mono-custom text-[10px] uppercase tracking-[1px]
                transition-all duration-100 cursor-pointer
                ${!isRightEdge ? "border-r-[3px] border-ink" : ""}
                ${!isLastRow ? "border-b-[3px] border-ink" : ""}
                ${isActive
                                    ? "bg-cream-dark text-brown font-bold"
                                    : "bg-cream text-ink hover:bg-brown-pale"
                                }
              `}
                        >
                            <span className={isActive ? "text-brown" : "text-brown-mid"}>
                                {m.icon}
                            </span>
                            {m.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}