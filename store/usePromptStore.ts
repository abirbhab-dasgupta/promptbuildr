import { create } from "zustand";
import { Mode, Model, Tone, PromptResponse, HistoryItem } from "@/types";

interface PromptStore {
    // Selections
    mode: Mode;
    model: Model;
    tone: Tone;
    idea: string;

    // Output
    response: PromptResponse | null;
    isLoading: boolean;
    error: string | null;

    // History panel
    isHistoryOpen: boolean;
    history: HistoryItem[];

    // Actions
    setMode: (mode: Mode) => void;
    setModel: (model: Model) => void;
    setTone: (tone: Tone) => void;
    setIdea: (idea: string) => void;
    setResponse: (response: PromptResponse | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    toggleHistory: () => void;
    closeHistory: () => void;
    setHistory: (history: HistoryItem[]) => void;
    reset: () => void;
}

const defaultState = {
    mode: "code" as Mode,
    model: "chatgpt" as Model,
    tone: "professional" as Tone,
    idea: "",
    response: null,
    isLoading: false,
    error: null,
    isHistoryOpen: false,
    history: [],
};

export const usePromptStore = create<PromptStore>((set) => ({
    ...defaultState,

    setMode: (mode) => set({ mode, response: null, error: null }),
    setModel: (model) => set({ model, response: null, error: null }),
    setTone: (tone) => set({ tone }),
    setIdea: (idea) => set({ idea }),
    setResponse: (response) => set({ response }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    toggleHistory: () => set((s) => ({ isHistoryOpen: !s.isHistoryOpen })),
    closeHistory: () => set({ isHistoryOpen: false }),
    setHistory: (history) => set({ history }),
    reset: () => set({ ...defaultState }),
}));