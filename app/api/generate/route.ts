import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { checkRateLimit } from "@/lib/ratelimit";
import { buildPrompt } from "@/lib/prompts";

// ── VALIDATION SCHEMA ─────────────────────────────────────
const RequestSchema = z.object({
    idea: z
        .string()
        .min(5, "Idea must be at least 5 characters")
        .max(1000, "Idea must be under 1000 characters"),
    mode: z.enum(["code", "image", "writing", "agent", "study", "general"]),
    model: z.enum(["chatgpt", "claude", "gemini", "midjourney"]),
    tone: z.enum(["professional", "casual", "technical", "creative"]),
});

// ── GEMINI CLIENT ─────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ── PARSE AI RESPONSE ─────────────────────────────────────
function parseResponse(raw: string): {
    prompt: string;
    explanations: string[];
} {
    try {
        const clean = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        const parsed = JSON.parse(clean);

        if (!parsed.prompt || !Array.isArray(parsed.explanations)) {
            throw new Error("Invalid response shape");
        }

        return {
            prompt: parsed.prompt,
            explanations: parsed.explanations.slice(0, 3),
        };
    } catch {
        return {
            prompt: raw,
            explanations: [
                "A role was assigned to focus the AI on the right expertise.",
                "Context was added to reduce ambiguity in the output.",
                "Output format was specified to improve response structure.",
            ],
        };
    }
}

// ── ROUTE HANDLER ─────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            req.headers.get("x-real-ip") ??
            "anonymous";

        const { success, remaining } = await checkRateLimit(ip);

        if (!success) {
            return NextResponse.json(
                {
                    error:
                        "Too many requests. Please wait a minute and try again.",
                },
                {
                    status: 429,
                    headers: { "X-RateLimit-Remaining": String(remaining) },
                }
            );
        }

        // 2. Parse + validate body
        const body = await req.json();
        const result = RequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { idea, mode, model, tone } = result.data;

        // 3. Build model-specific system prompt
        const systemPrompt = buildPrompt(idea, mode, model, tone);

        // 4. Call Gemini
        const geminiModel = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 1024,
                responseMimeType: "application/json",
            },
        });

        const geminiResult = await geminiModel.generateContent(systemPrompt);
        const raw = geminiResult.response.text();

        // 5. Parse and return
        const parsed = parseResponse(raw);

        return NextResponse.json(parsed, {
            status: 200,
            headers: {
                "X-RateLimit-Remaining": String(remaining),
            },
        });
    } catch (err: unknown) {
        console.error("[generate] error:", err);

        // Gemini 429 — quota exceeded
        if (
            err instanceof Error &&
            (err.message.includes("429") || err.message.toLowerCase().includes("quota"))
        ) {
            return NextResponse.json(
                {
                    error:
                        "AI quota exceeded. Please wait a moment and try again.",
                },
                { status: 429 }
            );
        }

        // Gemini 503 — model overloaded
        if (
            err instanceof Error &&
            err.message.includes("503")
        ) {
            return NextResponse.json(
                {
                    error:
                        "AI model is currently overloaded. Please try again shortly.",
                },
                { status: 503 }
            );
        }

        // Gemini auth error
        if (
            err instanceof Error &&
            err.message.includes("API key")
        ) {
            return NextResponse.json(
                { error: "API configuration error. Please contact support." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}