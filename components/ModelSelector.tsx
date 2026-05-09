"use client";

import Image from "next/image";
import { Model } from "@/types";
import { usePromptStore } from "@/store/usePromptStore";

const models: {
    value: Model;
    label: string;
    icon: string;
}[] = [
        {
            value: "chatgpt",
            label: "ChatGPT",
            icon: "/chatgpt.svg",
        },
        {
            value: "claude",
            label: "Claude",
            icon: "/claude.svg",
        },
        {
            value: "gemini",
            label: "Gemini",
            icon: "/gemini.svg",
        },
        {
            value: "midjourney",
            label: "Midjourney",
            icon: "/midjourney.svg",
        },
    ];

export default function ModelSelector() {
    const { model, setModel } = usePromptStore();

    return (
        <div className="mb-5">
            <span className="block font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-60 mb-2">
                Target Model
            </span>

            <div className="grid grid-cols-2 border-brutal">
                {models.map((m, i) => {
                    const isActive = model === m.value;
                    const isRightCol = i % 2 !== 0;
                    const isBottomRow = i >= 2;

                    return (
                        <button
                            key={m.value}
                            onClick={() => setModel(m.value)}
                            className={`
                flex items-center gap-2.5
                px-3 py-3
                font-mono-custom text-[11px] uppercase tracking-[1px]
                transition-all duration-100 cursor-pointer text-left
                ${isRightCol ? "" : "border-r-[3px] border-ink"}
                ${isBottomRow ? "" : "border-b-[3px] border-ink"}
                ${isActive
                                    ? "bg-brown text-cream"
                                    : "bg-cream text-ink hover:bg-brown-pale"
                                }
              `}
                        >
                            <Image src={m.icon} alt={m.label} width={16} height={16} className={isActive ? "brightness-200" : "opacity-70"} />
                            <span className="flex flex-col">
                                <span className="font-bold">{m.label}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}