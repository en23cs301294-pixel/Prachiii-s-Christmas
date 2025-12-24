
import { GoogleGenAI, Type } from "@google/genai";
import { ChristmasPoem } from "../types";

export const generateChristmasPoem = async (crushName: string, mood: string): Promise<ChristmasPoem> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY is missing. Please add it to your Hosting Provider's Environment Variables (Vercel/Netlify settings).");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, festive Christmas poem for ${crushName}. 
      The mood is ${mood}. 
      RULES: 
      1. DO NOT use the word "love". 
      2. Use words like "sparkle", "wonder", "festive", "shine", "magic". 
      3. Maximum 8 lines.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"]
        }
      }
    });

    if (!response.text) {
      throw new Error("The North Pole is busy. Please try again in a moment!");
    }

    return JSON.parse(response.text);
  } catch (err: any) {
    console.error("Gemini API Error Detail:", err);
    throw new Error(err.message || "Failed to connect to Santa's workshop.");
  }
};
