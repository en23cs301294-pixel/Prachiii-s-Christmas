
import { GoogleGenAI, Type } from "@google/genai";
import { ChristmasPoem } from "../types";

export const generateChristmasPoem = async (crushName: string, mood: string): Promise<ChristmasPoem> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Magic Key Missing: Go to Netlify settings and add your 'API_KEY'.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, festive Christmas poem for ${crushName}. 
      The mood is ${mood}. 
      RULES: 
      1. DO NOT use the word "love". 
      2. Use words like "sparkle", "wonder", "festive", "shine". 
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
      throw new Error("Empty response from the North Pole.");
    }

    return JSON.parse(response.text);
  } catch (err: any) {
    console.error("Gemini Error:", err);
    throw new Error(err.message || "Failed to connect to Santa's workshop.");
  }
};
