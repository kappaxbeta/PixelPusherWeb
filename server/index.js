import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "gemma4:e2b";

app.post("/api/ai/generate", async (req, res) => {
    try {
        const { prompt, systemPrompt } = req.body;
        
        console.log(`[AI Proxy] Forwarding request to Ollama Chat for: "${prompt.substring(0, 50)}..."`);
        
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL_NAME,
            messages: [
                { 
                    role: "system", 
                    content: systemPrompt + " STRICT RULE: Output ONLY the NPC dialogue. Do not include any thinking, reasoning, internal monologue, or meta-commentary. Do not use numbered lists or bold headers. IMPORTANT: DO NOT include 'Thinking Process' or any reasoning in your response. JUMP DIRECTLY TO THE DIALOGUE. IF YOU INCLUDE REASONING, THE GAME WILL BREAK." 
                },
                { role: "user", content: prompt }
            ],
            stream: false,
            options: {
                num_predict: 500,
                temperature: 0.9,
                top_p: 0.9
            }
        }, { timeout: 60000 });

        // Ollama Chat API returns { message: { content: "...", thinking: "..." } }
        const message = response.data.message;
        let aiResponse = (message?.content || message?.thinking || "").trim();
        console.log(`[AI Proxy] Raw response: "${aiResponse}"`);
        
        const originalResponse = aiResponse;
        
        // Clean up Gemma 4 reasoning / prompt echoes
        aiResponse = aiResponse.replace(/Thinking Process:[\s\S]*?(?=\n\n|\n[0-9]|\.\.\.done thinking|$)/gi, "");
        aiResponse = aiResponse.replace(/^\s*\*.*$/gm, ""); // Remove lines starting with *
        aiResponse = aiResponse.replace(/^[0-9]\.\s.*\n?/gm, ""); // Remove numbered lists
        aiResponse = aiResponse.replace(/\*\*.*\*\*:\s?/g, ""); // Remove bold headers (e.g. **Character**:)
        aiResponse = aiResponse.replace(/\.\.\.done thinking\.?/gi, "");
        
        // Remove any remnant of the system instruction phrases IF they are at the start
        aiResponse = aiResponse.replace(/^Respond as this character.*/gi, "");
        aiResponse = aiResponse.replace(/^Output ONLY.* dialogue/gi, "");
        
        aiResponse = aiResponse.trim();
        
        // If stripping removed everything useful, but we had a response, use the original (capped)
        if (!aiResponse && originalResponse) {
            aiResponse = originalResponse.substring(0, 200).replace(/\n/g, " ");
        }
        
        // Final fallback if totally empty
        if (!aiResponse) {
            aiResponse = "You lookin' for the good stuff or what?";
        }

        console.log(`[AI Proxy] Final cleaned response: "${aiResponse}"`);
        res.json({ response: aiResponse });
    } catch (err) {
        console.error("[AI Proxy] Error communicating with Ollama:", err.response?.data || err.message);
        res.status(500).json({ 
            error: "Ollama Error", 
            message: err.response?.data?.error || err.message
        });
    }
});

app.get("/health", async (req, res) => {
    try {
        const response = await axios.get("http://localhost:11434/api/tags");
        res.json({ 
            status: "alive", 
            engine: "Ollama (Go)",
            models: response.data.models.map(m => m.name)
        });
    } catch (err) {
        res.json({ status: "degraded", message: "Ollama not reachable" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[AI Proxy] Listening on http://localhost:${PORT}`);
    console.log(`[AI Proxy] Using Go-based Ollama engine for Gemma 4 support.`);
});
