import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL_DIR = path.join(__dirname, "models");
const MODEL_PATH = path.join(__dirname, "models", "gemma-4-E2B-it-Q4_K_M.gguf");

// Using Unsloth's optimized GGUF (approx 1.5GB)
const MODEL_URL = "https://huggingface.co/unsloth/gemma-4-E2B-it-GGUF/resolve/main/gemma-4-E2B-it-Q4_K_M.gguf";

async function downloadModel() {
    if (!fs.existsSync(MODEL_DIR)) {
        console.log("[Downloader] Creating models directory...");
        fs.mkdirSync(MODEL_DIR, { recursive: true });
    }

    if (fs.existsSync(MODEL_PATH)) {
        console.log("[Downloader] Model already exists at:", MODEL_PATH);
        return;
    }

    console.log("[Downloader] Starting download of Gemma 4 E2B (~1.5GB)...");
    console.log("[Downloader] Source: ", MODEL_URL);

    try {
        const response = await axios({
            method: "get",
            url: MODEL_URL,
            responseType: "stream",
            timeout: 0 // No timeout for large file downloads
        });

        const totalLength = parseInt(response.headers["content-length"] || "0", 10);
        let downloadedLength = 0;
        const writer = fs.createWriteStream(MODEL_PATH);

        console.log(`[Downloader] Total Size: ${(totalLength / 1024 / 1024).toFixed(2)} MB`);

        response.data.on("data", (chunk) => {
            downloadedLength += chunk.length;
            if (downloadedLength % (5 * 1024 * 1024) < chunk.length) { // Log progress every 5MB
                const progress = ((downloadedLength / totalLength) * 100).toFixed(2);
                process.stdout.write(`\r[Downloader] Progress: ${progress}% (${(downloadedLength / 1024 / 1024).toFixed(2)} MB / ${(totalLength / 1024 / 1024).toFixed(2)} MB)`);
            }
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log("\n[Downloader] Download Complete! Your self-contained AI is ready.");
                resolve();
            });
            writer.on("error", (err) => {
                console.error("\n[Downloader] Stream Error:", err);
                reject(err);
            });
        });
    } catch (err) {
        console.error("\n[Downloader] Failed to initiate download:", err.message);
        if (err.response?.status === 404) {
            console.error("[Downloader] Error: The model URL appears to be invalid or moved.");
        }
    }
}

downloadModel();
