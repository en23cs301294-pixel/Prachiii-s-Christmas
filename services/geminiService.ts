
import { GoogleGenAI, Type } from "@google/genai";
import { ChristmasPoem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChristmasPoem = async (crushName: string, mood: string): Promise<ChristmasPoem> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, sweet, and festive Christmas poem for someone named ${crushName}. 
    The mood should be ${mood}. 
    CRITICAL REQUIREMENT: Do NOT use the word "love" (or variations like "loving", "beloved") in the poem at all. 
    Focus on words like "wonderful", "sparkling presence", "magical", or "special person".`,
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

  return JSON.parse(response.text);
};
