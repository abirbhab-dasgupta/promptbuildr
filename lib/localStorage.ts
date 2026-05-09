import { HistoryItem } from "@/types";

const STORAGE_KEY = "promptbuildr_history";
const MAX_ITEMS = 50;

export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

export function saveToHistory(item: Omit<HistoryItem, "id" | "date">): HistoryItem {
    const history = getHistory();
    const newItem: HistoryItem = {
        ...item,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    };
    const updated = [newItem, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
}

export function deleteFromHistory(id: number): HistoryItem[] {
    const updated = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}