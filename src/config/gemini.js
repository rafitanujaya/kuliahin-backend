import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./index.js";

export const gemini = new GoogleGenerativeAI(config.GEMINI_API_KEY)
