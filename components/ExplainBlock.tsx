"use client";

import { Lightbulb } from "lucide-react";

interface ExplainBlockProps {
    explanations: string[];
}

export default function ExplainBlock({ explanations }: ExplainBlockProps) {
    if (!explanations || explanations.length === 0) return null;

    return (
        <div className="border-brutal mt-0">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-brown-mid border-b-[3px] border-ink">
                <Lightbulb size={14} strokeWidth={2} className="text-cream-dark" />
                <span className="font-display text-[15px] tracking-[2px] text-cream uppercase">
                    Why This Works
                </span>
            </div>

            {/* Explanation items */}
            <div className="bg-cream-dark divide-y-2px divide-brown-pale">
                {explanations.map((exp, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3">
                        {/* Index dot */}
                        <span className="mt-0.5 min-w-[20px] h-5 flex items-center justify-center bg-brown text-cream font-mono-custom text-[9px] font-bold">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="font-mono-custom text-[11px] leading-relaxed text-ink">
                            {exp}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}