/**
 * AI Service for communicating with the local Express.js backend.
 * Provides real-time response generation from Gemma 4 E2B.
 */

const BACKEND_URL = "http://localhost:3001/api/ai/generate";

export async function getNPCResponse(npcName, role, context = "talking to a player") {
    console.log(`[AI Service] Requesting response for ${npcName} (${role})...`);

    const prompt = `Give me a short, 1-sentence catchphrase or response as ${npcName}. Context: ${context}.`;
    const systemPrompt = `
        You are ${npcName}, a ${role} in the futuristic cyberpunk city of Pixelopolis. 
        Your responses must be:
        1. Very short (one sentence maximal).
        2. In-character for a ${role}.
        3. Gruff, street-smart, or mysterious depending on your personality.
        4. Focus on the vibe of a "Weed Empire" street life.
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
