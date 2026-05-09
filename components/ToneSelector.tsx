"use client";

import { Briefcase, MessageCircle, Terminal, Wand2 } from "lucide-react";
import { Tone } from "@/types";
import { usePromptStore } from "@/store/usePromptStore";

const tones: {
    value: Tone;
    label: string;
    icon: React.ReactNode;
}[] = [
        {
            value: "professional",
            label: "Professional",
            icon: <Briefcase size={14} strokeWidth={2} />,
        },
        {
            value: "casual",
            label: "Casual",
            icon: <MessageCircle size={14} strokeWidth={2} />,
        },
        {
            value: "technical",
            label: "Technical",
            icon: <Terminal size={14} strokeWidth={2} />,
        },
        {
            value: "creative",
            label: "Creative",
            icon: <Wand2 size={14} strokeWidth={2} />,
        },
    ];

export default function ToneSelector() {
    const { tone, setTone } = usePromptStore();

    return (
        <div className="mt-5">
            <span className="block font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-60 mb-2">
                Tone
            </span>

            <div className="flex border-brutal">
                {tones.map((t, i) => {
                    const isActive = tone === t.value;
                    const isLast = i === tones.length - 1;

                    return (
                        <button
                            key={t.value}
                            onClick={() => setTone(t.value)}
                            className={`
                flex-1 flex flex-col items-center justify-center gap-1
                py-2.5 px-1
                font-mono-custom text-[9px] uppercase tracking-[0.8px]
                transition-all duration-100 cursor-pointer
                ${isLast ? "" : "border-r-[3px] border-ink"}
                ${isActive
                                    ? "bg-sienna text-cream"
                                    : "bg-cream text-ink hover:bg-brown-pale"
                                }
              `}
                        >
                            <span className={isActive ? "text-cream-dark" : "text-brown-mid"}>
                                {t.icon}
                            </span>
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}