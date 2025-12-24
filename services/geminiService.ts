
import { GoogleGenAI, Type } from "@google/genai";
import { ChristmasPoem } from "../types";

export const generateChristmasPoem = async (crushName: string, mood: string): Promise<ChristmasPoem> => {
  // Access API key from injected environment variables
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("Missing API Key. Please add 'API_KEY' to your hosting environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a beautiful, festive Christmas poem for ${crushName}. 
      The mood is ${mood}. 
      RULES: 
      1. DO NOT use the word "love". 
      2. Use words like "sparkle", "wonder", "festive", "shine", "magic". 
      3. Focus on friendship, warmth, and holiday joy.
      4. Maximum 8 lines.`,
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
      throw new Error("The North Pole is busy. Please try again!");
    }

    return JSON.parse(response.text);
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    if (err.message?.includes("API_KEY_INVALID")) {
      throw new Error("Your API Key is invalid. Check your Gemini dashboard.");
    }
    throw new Error(err.message || "Failed to reach Santa's workshop.");
  }
};
