"use client";

import { X, Trash2, RotateCcw, Clock } from "lucide-react";
import { usePromptStore } from "@/store/usePromptStore";
import { useHistory } from "@/hooks/useHistory";
import { HistoryItem } from "@/types";

export default function HistoryPanel() {
    const { isHistoryOpen, closeHistory, setMode, setModel, setTone, setIdea, setResponse } =
        usePromptStore();
    const { history, remove, clear } = useHistory();

    function handleLoad(item: HistoryItem) {
        setMode(item.mode);
        setModel(item.model);
        setTone(item.tone);
        setIdea(item.idea);
        setResponse({ prompt: item.prompt, explanations: item.explanations });
        closeHistory();
    }

    return (
        <>
            {/* Overlay */}
            <div
                onClick={closeHistory}
                className={`
          fixed inset-0 bg-ink/60 backdrop-blur-sm z-40
          transition-opacity duration-200
          ${isHistoryOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
            />

            {/* Panel */}
            <div
                className={`
          fixed top-0 right-0 bottom-0 z-50
          w-full max-w-[480px]
          bg-cream border-l-[3px] border-ink
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isHistoryOpen ? "translate-x-0" : "translate-x-full"}
        `}
                style={{ boxShadow: isHistoryOpen ? "-8px 0 0 #2c1a0e" : "none" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-brown border-b-[3px] border-ink">
                    <div className="flex items-center gap-2">
                        <Clock size={16} strokeWidth={2} className="text-cream-dark" />
                        <h3 className="font-display text-[22px] tracking-[2px] text-cream uppercase">
                            Saved Prompts
                        </h3>
                    </div>
                    <button
                        onClick={closeHistory}
                        className="w-8 h-8 flex items-center justify-center bg-sienna border-brutal-2 text-cream hover:bg-cream hover:text-ink transition-all duration-100 cursor-pointer"
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Count bar */}
                <div className="px-5 py-2 bg-cream-mid border-b-[3px] border-ink">
                    <span className="font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-60">
                        {history.length} saved — stored locally in your browser
                    </span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                            <div className="font-display text-[60px] text-brown-pale leading-none select-none">
                                0
                            </div>
                            <p className="font-mono-custom text-[10px] uppercase tracking-[2px] text-brown-mid opacity-40 leading-relaxed">
                                No saved prompts yet.
                                <br />
                                Generate a prompt and hit Save.
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="border-brutal bg-cream shadow-brutal hover:shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100"
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between px-3 py-2 border-b-2px border-ink bg-cream-mid">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {[item.model, item.mode, item.tone].map((tag) => (
                                            <span
                                                key={tag}
                                                className="font-mono-custom text-[8px] uppercase tracking-[1px] bg-brown text-cream px-1.5 py-0.5"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="font-mono-custom text-[9px] text-brown-mid opacity-50">
                                        {item.date}
                                    </span>
                                </div>

                                {/* Idea preview */}
                                <div className="px-3 py-2.5 border-b-2px border-ink">
                                    <p className="font-mono-custom text-[11px] text-ink opacity-70 leading-relaxed line-clamp-2">
                                        {item.idea}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex">
                                    <button
                                        onClick={() => handleLoad(item)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-r-2px border-ink font-mono-custom text-[9px] uppercase tracking-[1px] text-ink hover:bg-brown hover:text-cream transition-all duration-100 cursor-pointer"
                                    >
                                        <RotateCcw size={11} strokeWidth={2} />
                                        Load
                                    </button>
                                    <button
                                        onClick={() => remove(item.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-mono-custom text-[9px] uppercase tracking-[1px] text-ink hover:bg-sienna hover:text-cream transition-all duration-100 cursor-pointer"
                                    >
                                        <Trash2 size={11} strokeWidth={2} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                    <div className="p-4 border-t-[3px] border-ink bg-brown">
                        <button
                            onClick={() => {
                                if (confirm("Clear all saved prompts? This cannot be undone.")) {
                                    clear();
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-sienna text-cream border-brutal-2 font-mono-custom text-[10px] uppercase tracking-[1.5px] hover:bg-cream hover:text-sienna transition-all duration-100 cursor-pointer"
                        >
                            <Trash2 size={12} strokeWidth={2} />
                            Clear All History
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}