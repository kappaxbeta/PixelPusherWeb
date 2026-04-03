/**
 * AI Service for communicating with the local Express.js backend.
 * Provides real-time response generation from Gemma 4 E2B.
 */

const BACKEND_URL = "http://localhost:3001/api/ai/generate";

import { economy } from "./economy";

export async function getNPCResponse(npcName, role, context = "talking to a player") {
    console.log(`[AI Service] Requesting response for ${npcName} (${role})...`);

    const marketSummary = economy.getEconomySummary();
    const moods = ["suspicious", "aggressive", "friendly", "hurried", "mysterious", "cynical", "greedy", "paranoid"];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    const prompt = `State of mind: ${mood}. Market: ${marketSummary}. Give me a 1-sentence catchphrase for ${npcName}.`;
    const systemPrompt = `
        You are ${npcName}, a ${role} in our cyberpunk city. 
        Current State: You are feeling ${mood}.
        Current Market: ${marketSummary}.
        STRICT RULES:
        1. Output ONLY dialogue (one short sentence).
        2. No labels, no headers, no thinking process.
        3. Stay in character for a ${role} who is ${mood}.
    `;

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                systemPrompt
            }),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log(`[AI Service] Received: "${data.response}"`);
        return data.response;
    } catch (err) {
        console.error("[AI Service] Error:", err.message);
        // Fallback for when the server is down or model is not loaded
        return "You looking for something, or just standing there?";
    }
}
