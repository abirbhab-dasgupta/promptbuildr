"use client";

import { useState, useEffect, useCallback } from "react";
import { Hammer, Clock, Shield, ChevronDown, Mail } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left — text */}
          <div>
            <div className="badge-pop inline-block bg-brown text-cream font-mono-custom text-[10px] uppercase tracking-[2px] px-3 py-1.5 border-brutal shadow-brutal-sm mb-4">
              AI Prompt Builder
            </div>

            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-[3px] uppercase animate-slide-up-d1">
              Turn your
              <span className="block text-sienna-warm">idea</span>
              <span className="text-stroke block">into a</span>
              <span className="block">killer prompt</span>
            </h1>

            <p className="font-mono-custom text-[12px] leading-relaxed opacity-60 mt-4 animate-slide-up-d2">
              Paste a raw idea. Get a powerful, model-specific prompt.
              No fluff. No logins. No data sent anywhere — ever.
            </p>

            <div className="animate-slide-up-d3 mt-4 inline-flex items-center gap-2 bg-brown-pale border-brutal shadow-brutal-sm px-4 py-2">
              <Shield size={13} strokeWidth={2} className="text-brown" />
              <span className="font-mono-custom text-[10px] uppercase tracking-[1px] text-ink">
                100% local — your data lives only in your browser
              </span>
            </div>
          </div>

          {/* Right — stats/features card */}
          <div className="hidden lg:flex flex-col gap-0 border-brutal shadow-brutal-lg animate-slide-up-d2">

            {/* Card header */}
            <div className="bg-brown px-5 py-3 border-b-[3px] border-ink">
              <span className="font-display text-[16px] tracking-[2px] text-cream uppercase">
                What PromptBuildr does
              </span>
            </div>

            {/* Feature rows */}
            {[
              { num: "01", title: "Model-Specific", desc: "Optimized for ChatGPT, Claude, Gemini & Midjourney" },
              { num: "02", title: "6 Prompt Modes", desc: "Code, Image, Writing, Agent, Study, General" },
              { num: "03", title: "Explainability", desc: "Learn WHY each part of your prompt works" },
              { num: "04", title: "100% Private", desc: "Zero server storage — localStorage only" },
            ].map((f, i, arr) => (
              <div
                key={f.num}
                className={`flex items-start gap-4 px-5 py-4 bg-cream hover:bg-cream-dark transition-colors duration-100 ${i < arr.length - 1 ? "border-b-[3px] border-ink" : ""}`}
              >
                <span className="font-display text-[28px] text-brown-pale leading-none select-none min-w-[36px]">
                  {f.num}
                </span>
                <div>
                  <p className="font-display text-[15px] tracking-[1.5px] uppercase text-brown">
                    {f.title}
                  </p>
                  <p className="font-mono-custom text-[10px] leading-relaxed text-ink opacity-60 mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── MAIN BUILDER GRID ── */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-brutal shadow-brutal-lg lg:grid-rows-[1fr]">

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

            {/* Scrollable input area */}
            <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
              <ModeSelector />
              <ModelSelector />
              <IdeaInput />
              <ToneSelector />
            </div>

            {/* Generate button — pinned at bottom of left panel */}
            <div className="p-5 pt-0 border-t-[3px] border-ink mt-auto">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`
            relative w-full py-4 overflow-hidden
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

            {/* Output takes remaining height — buttons aligned with generate */}
            <div className="flex-1 flex flex-col">
              <PromptOutput />
            </div>

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

          {/* Made by */}
          <p className="font-mono-custom text-[10px] uppercase tracking-[1px] text-brown-light text-center">
            Made by{" "}
            <a
              href="https://abirbhabdasgupta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream-dark border-b-1px border-cream-dark border-dashed hover:text-cream hover:border-cream transition-colors duration-100"
            >
              Abirbhab Dasgupta
            </a>
          </p>

          {/* Social links */}
          <div className="flex items-center gap-0 border-brutal-2">
            <a
              href="https://github.com/abirbhab-dasgupta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 border-r-2px border-ink bg-brown hover:bg-cream-dark hover:text-ink transition-colors duration-100 group"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" className="text-cream group-hover:text-ink">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="font-mono-custom text-[9px] uppercase tracking-[1px] text-cream group-hover:text-ink">
                GitHub
              </span>
            </a>

            <a
              href="https://linkedin.com/in/abirbhab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 border-r-2px border-ink bg-brown hover:bg-cream-dark hover:text-ink transition-colors duration-100 group"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" className="text-cream group-hover:text-ink">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="font-mono-custom text-[9px] uppercase tracking-[1px] text-cream group-hover:text-ink">
                LinkedIn
              </span>
            </a>

            <a
              href="mailto:abirbhab00dasgupta@gmail.com"
              className="flex items-center gap-1.5 px-3 py-2 bg-brown hover:bg-cream-dark hover:text-ink transition-colors duration-100 group"
              title="Email"
            >
              <Mail size={13} strokeWidth={2} className="text-cream group-hover:text-ink" />
              <span className="font-mono-custom text-[9px] uppercase tracking-[1px] text-cream group-hover:text-ink">
                Mail
              </span>
            </a>
          </div>

        </div>
      </footer>

      {/* ── HISTORY PANEL ── */}
      <HistoryPanel />

      {/* ── TOAST ── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}