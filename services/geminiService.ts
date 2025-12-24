
import { GoogleGenAI, Type } from "@google/genai";
import { ChristmasPoem } from "../types";

export const generateChristmasPoem = async (crushName: string, mood: string): Promise<ChristmasPoem> => {
  // Initialize inside the function to be safer during deployment boot-up
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
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

  if (!response.text) {
    throw new Error("No response from Santa's workshop");
  }

  return JSON.parse(response.text);
};
