import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazy-loaded with robust validation
function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined. Please set it in Settings > Secrets or .env file.");
    }
    return new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
            headers: {
                'User-Agent': 'aistudio-build',
            }
        }
    });
}

// API endpoint for AI content generation
async function generateWithRetryAndFallback(prompt: string): Promise<string> {
    const ai = getGeminiClient();
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // List of models to try in sequence of preference
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    
    let lastError: any = null;

    for (const model of modelsToTry) {
        let attempts = 3;
        let delayMs = 300;

        for (let i = 0; i < attempts; i++) {
            try {
                console.log(`Attempting generation with model: ${model}, attempt ${i + 1}`);
                const response = await ai.models.generateContent({
                    model: model,
                    contents: prompt,
                });

                if (response?.text) {
                    console.log(`Successfully generated content using model: ${model}`);
                    return response.text;
                }
            } catch (error: any) {
                lastError = error;
                const errString = error.message || String(error);
                console.warn(`Error using model ${model} (attempt ${i + 1}):`, errString);

                // If the model is completely unavailable or under high demand, do NOT waste time retrying it.
                // Immediately break the attempt loop to try the next model.
                const isOverloadedOrUnavailable = errString.includes("503") || 
                                                    errString.includes("UNAVAILABLE") || 
                                                    errString.includes("high demand") ||
                                                    errString.includes("RESOURCE_EXHAUSTED");

                if (isOverloadedOrUnavailable) {
                    console.log(`Model ${model} is overloaded or unavailable. Instantly falling back to the next model...`);
                    break;
                }

                // For other transient errors, we can retry with exponential backoff
                const isTransient = errString.includes("500") || 
                                    errString.includes("429") || 
                                    errString.includes("timeout");

                if (isTransient && i < attempts - 1) {
                    console.log(`Transient error on ${model}, waiting ${delayMs}ms before retry...`);
                    await delay(delayMs);
                    delayMs *= 2; // exponential backoff
                } else {
                    // For non-transient errors or exhausted attempts, try next model
                    break;
                }
            }
        }
    }

    throw lastError || new Error("Failed to generate content with all configured models.");
}

app.post("/api/general-ai", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        const reply = await generateWithRetryAndFallback(prompt);
        res.json({ reply });
    } catch (error: any) {
        console.error("Gemini API Error after retries/fallback:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Serve static files
const distPath = path.join(process.cwd(), "dist");
const rootPath = process.cwd();

if (fs.existsSync(path.join(distPath, "index.html"))) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    app.use(express.static(rootPath));
    app.get("*", (req, res) => {
        res.sendFile(path.join(rootPath, "index.html"));
    });
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
