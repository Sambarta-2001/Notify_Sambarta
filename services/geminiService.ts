import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateCampaignMessages = async (productInfo: string): Promise<string[]> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    return new Promise(resolve => setTimeout(() => resolve([
        "Unlock 15% off on your next purchase! ✨",
        "New arrivals just dropped! Be the first to see.",
        "Flash Sale Ending Soon! Don't miss out on great deals."
    ]), 1000));
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 short, catchy, and effective notification messages for a marketing campaign based on the following product information: "${productInfo}". The messages should be under 140 characters.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              description: "A list of 3 campaign message suggestions.",
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && Array.isArray(result.suggestions)) {
        return result.suggestions;
    }

    return [];
  } catch (error) {
    console.error("Error generating campaign messages:", error);
    // Return empty array on error to prevent UI crash
    return [];
  }
};
