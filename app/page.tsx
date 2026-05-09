"use client";

import { useState, useEffect, useCallback } from "react";
import { Hammer, Clock, Shield, ChevronDown } from "lucide-react";
import { usePromptStore } from "@/store/usePromptStore";
import ModeSelector from "@/components/ModeSelector";
import ModelSelector from "@/components/ModelSelector";
import ToneSelector from "@/components/ToneSelector";
import IdeaInput from "@/components/IdeaInput";
import PromptOutput from "@/components/PromptOutput";
import HistoryPanel from "@/components/HistoryPanel";

// ── TOAST ─────────────────────────────────────────────────
function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2
        px-5 py-3 border-brutal shadow-brutal
        font-mono-custom text-[11px] uppercase tracking-[1.5px]
        whitespace-nowrap z-999 toast-in
        ${type === "success" ? "bg-green text-cream" : "bg-sienna text-cream"}
      `}
    >
      {message}
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────
export default function Home() {
  const {
    idea,
    mode,
    model,
    tone,
    isLoading,
    setLoading,
    setResponse,
    setError,
    toggleHistory,
    error,
  } = usePromptStore();

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Show toast helper
  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2800);
  }

  // Keyboard shortcut — Ctrl/Cmd + Enter to generate
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleGenerate();
      }
    },
    [idea, mode, model, tone, isLoading]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── GENERATE ──────────────────────────────────────────
  async function handleGenerate() {
    if (!idea.trim()) {
      showToast("Please describe your idea first.", "error");
      return;
    }
    if (idea.trim().length < 5) {
      showToast("Idea is too short — add more detail.", "error");
      return;
    }
    if (isLoading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, mode, model, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        showToast(data.error || "Something went wrong.", "error");
        return;
      }

      setResponse(data);
      showToast("Prompt forged successfully.");
    } catch {
      setError("Network error. Please check your connection.");
      showToast("Network error. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-cream-dark border-b-[3px] border-ink">
        <div className="flex items-center gap-2">
          <Hammer size={20} strokeWidth={2.5} className="text-brown" />
          <span className="font-display text-[26px] tracking-[2px] text-ink">
            Prompt<span className="text-sienna">Buildr</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Privacy badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-brown px-3 py-1.5 border-brutal-2">
            <Shield size={11} strokeWidth={2} className="text-cream-dark" />
            <span className="font-mono-custom text-[9px] uppercase tracking-[1px] text-cream">
              Zero Data Sent
            </span>
          </div>

          {/* History button */}
          <button
            onClick={toggleHistory}
            className="flex items-center gap-1.5 bg-cream border-brutal px-3 py-1.5 shadow-brutal-sm shadow-brutal-hover font-mono-custom text-[10px] uppercase tracking-[1px] text-ink cursor-pointer"
          >
            <Clock size={12} strokeWidth={2} />
            History
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto w-full px-5 pt-10 pb-6">


        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-[3px] uppercase animate-slide-up-d1">
          Turn your
          <span className="block text-sienna-warm">idea</span>
          <span className="text-stroke block">into a</span>
          <span className="block">killer prompt</span>
        </h1>

        <p className="font-mono-custom text-[12px] leading-relaxed opacity-60 mt-4 max-w-md animate-slide-up-d2">
          Paste a raw idea. Get a powerful, model-specific prompt.
          No fluff. No logins. No data sent anywhere — ever.
        </p>

        <div className="animate-slide-up-d3 mt-4 inline-flex items-center gap-2 bg-brown-pale border-brutal shadow-brutal-sm px-4 py-2">
          <Shield size={13} strokeWidth={2} className="text-brown" />
          <span className="font-mono-custom text-[10px] uppercase tracking-[1px] text-ink">
            100% local — your data lives only in your browser
          </span>
        </div>
      </section>

      {/* ── MAIN BUILDER GRID ── */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-brutal shadow-brutal-lg lg:items-stretch">

          {/* LEFT — INPUT */}
          <div className="border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-ink bg-cream flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 bg-brown border-b-[3px] border-ink">
              <h2 className="font-display text-[20px] tracking-[2px] text-cream uppercase">
                Your Idea
              </h2>
              <span className="font-mono-custom text-[9px] bg-cream-dark text-brown px-2 py-1 border-2px border-cream-dark">
                STEP 01
              </span>
            </div>

            <div className="p-5">
              <ModeSelector />
              <ModelSelector />
              <IdeaInput />
              <ToneSelector />

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
                  relative w-full mt-5 py-4 overflow-hidden
                  border-brutal shadow-brutal
                  font-display text-[22px] tracking-[3px] uppercase
                  transition-all duration-100 cursor-pointer
                  group
                  ${isLoading
                    ? "bg-brown-pale text-brown-mid cursor-not-allowed shadow-brutal"
                    : "bg-cream-dark text-brown hover:shadow-brutal-sm hover:translate-x-[3px] hover:translate-y-[3px]"
                  }
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Hammer
                    size={18}
                    strokeWidth={2}
                    className={isLoading ? "animate-bounce" : ""}
                  />
                  {isLoading ? "Forging..." : "Forge Prompt"}
                </span>

                {/* Hover fill */}
                {!isLoading && (
                  <span className="absolute inset-0 bg-brown -translate-x-full group-hover:translate-x-0 transition-transform duration-200 z-0" />
                )}
                {!isLoading && (
                  <span className="absolute inset-0 flex items-center justify-center gap-2 font-display text-[22px] tracking-[3px] text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <Hammer size={18} strokeWidth={2} />
                    Forge Prompt
                  </span>
                )}
              </button>

              {/* Keyboard shortcut hint */}
              <p className="text-center font-mono-custom text-[9px] uppercase tracking-[1px] text-brown-mid opacity-40 mt-2">
                or press Ctrl + Enter
              </p>
            </div>
          </div>

          {/* RIGHT — OUTPUT */}
          <div className="bg-cream flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 bg-sienna border-b-[3px] border-ink">
              <h2 className="font-display text-[20px] tracking-[2px] text-cream uppercase">
                Your Prompt
              </h2>
              <span className="font-mono-custom text-[9px] bg-cream-dark text-brown px-2 py-1 border-2px border-cream-dark">
                STEP 02
              </span>
            </div>

            <PromptOutput />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-display text-[32px] tracking-[3px] uppercase text-ink">
            How it works
          </h2>
          <ChevronDown size={24} strokeWidth={2.5} className="text-sienna" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-brutal shadow-brutal-lg">
          {[
            {
              num: "01",
              title: "Pick Mode",
              desc: "Choose what kind of prompt you need — code, image, writing, AI agents, study, or general.",
            },
            {
              num: "02",
              title: "Choose Model",
              desc: "Select the AI you're using. Each model has its own prompting dialect — we optimize for it.",
            },
            {
              num: "03",
              title: "Drop Your Idea",
              desc: "Write your raw idea in plain language — like explaining it to a friend. No jargon needed.",
            },
            {
              num: "04",
              title: "Get + Learn",
              desc: "Get a powerful prompt AND an explanation of why each part works. Learn as you use it.",
            },
          ].map((step, i, arr) => (
            <div
              key={step.num}
              className={`
                p-6 bg-cream
                hover:bg-cream-dark transition-colors duration-100
                ${i < arr.length - 1 ? "border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-ink" : ""}
                ${i === 1 ? "sm:border-b-[3px] lg:border-b-0" : ""}
              `}
            >
              <div className="font-display text-[56px] text-brown-pale leading-none mb-2 select-none">
                {step.num}
              </div>
              <h3 className="font-display text-[18px] tracking-[2px] uppercase text-brown mb-2">
                {step.title}
              </h3>
              <p className="font-mono-custom text-[11px] leading-relaxed text-ink opacity-60">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-[3px] border-ink bg-brown mt-auto">
        <div className="max-w-5xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Hammer size={16} strokeWidth={2} className="text-cream-dark" />
            <span className="font-display text-[20px] tracking-[2px] text-cream">
              Prompt<span className="text-cream-dark">Buildr</span>
            </span>
          </div>
          <p className="font-mono-custom text-[9px] uppercase tracking-[1px] text-brown-light opacity-60 text-center">
            Built for engineers, students & builders
            <br />
            All data stored locally — your browser, your rules.
          </p>
          <p className="font-mono-custom text-[9px] uppercase tracking-[1px] text-brown-light opacity-40">
            promptbuildr.io
          </p>
        </div>
      </footer>

      {/* ── HISTORY PANEL ── */}
      <HistoryPanel />

      {/* ── TOAST ── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}