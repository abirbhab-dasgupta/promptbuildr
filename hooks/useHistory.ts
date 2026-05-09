import { useEffect } from "react";
import { usePromptStore } from "@/store/usePromptStore";
import {
    getHistory,
    saveToHistory,
    deleteFromHistory,
    clearHistory,
} from "@/lib/localStorage";
import { HistoryItem, PromptResponse } from "@/types";
import { Mode, Model, Tone } from "@/types";

export function useHistory() {
    const { setHistory, history } = usePromptStore();

    // Load history from localStorage on mount
    useEffect(() => {
        setHistory(getHistory());
    }, [setHistory]);

    function save(item: {
        idea: string;
        mode: Mode;
        model: Model;
        tone: Tone;
        response: PromptResponse;
    }) {
        saveToHistory({
            idea: item.idea,
            mode: item.mode,
            model: item.model,
            tone: item.tone,
            prompt: item.response.prompt,
            explanations: item.response.explanations,
        });
        setHistory(getHistory());
    }

    function remove(id: number) {
        deleteFromHistory(id);
        setHistory(getHistory());
    }

    function clear() {
        clearHistory();
        setHistory([]);
    }

    return { history, save, remove, clear };
}