import { GoogleGenerativeAI } from "@google/generative-ai";

const key = import.meta.env.VITE_GEMINI_API_KEY;
if (!key) {
  throw new Error("VITE_GEMINI_API_KEY is missing.");
}
const genAI = new GoogleGenerativeAI(key);

export const generateGeminiResponse = async (prompt) => {
  try {
    // Beddelna l-model hna l wa7ed jdid w kheddam (gemini-2.5-flash)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw error;
  }
};