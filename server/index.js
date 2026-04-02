import { getLlama, LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const MODEL_PATH = path.join(__dirname, "models", "gemma-4-E2B-it-Q4_K_M.gguf");

let model;
let llama;

async function initModel() {
    if (!fs.existsSync(MODEL_PATH)) {
        console.warn(`[AI Server] Model not found at ${MODEL_PATH}.`);
        console.warn(`[AI Server] Please run 'node download-model.js' to get the file.`);
        return;
    }
    
    try {
        console.log("[AI Server] Initializing Llama...");
        llama = await getLlama();
        console.log("[AI Server] Loading Gemma 4 E2B (GGUF)...");
        model = await llama.loadModel({ modelPath: MODEL_PATH });
        console.log("[AI Server] Model Loaded successfully!");
    } catch (err) {
        console.error("[AI Server] Failed to load model:", err);
    }
}

app.post("/api/ai/generate", async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: "Model not loaded. Ensure the .gguf file exists in server/models/" });
    }

    try {
        const { prompt, systemPrompt } = req.body;
        console.log(`[AI Server] Generating response for: "${prompt.substring(0, 50)}..."`);
        
        const context = await model.createContext();
        const session = new LlamaChatSession({ 
            context,
            systemPrompt: systemPrompt || "You are a helpful NPC in a futuristic cyberpunk city. Be concise and stay in character."
        });
        
        const response = await session.prompt(prompt);
        res.json({ response });
    } catch (err) {
        console.error("[AI Server] Generative Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/health", (req, res) => {
    res.json({ 
        status: "alive", 
        modelLoaded: !!model,
        modelPath: MODEL_PATH 
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[AI Server] Listening on http://localhost:${PORT}`);
    initModel();
});
