import { GoogleGenAI } from "@google/genai";
import { Billboard, Client } from "../types";

// Safe access to API Key for browser environments
const getApiKey = () => {
  try {
    // Check if process exists (Node/Polyfill) and has env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return '';
};

const apiKey = getApiKey();
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateBillboardDescription = async (billboard: Billboard): Promise<string> => {
  if (!ai) return `Premium billboard located at ${billboard.location} in ${billboard.town}. High visibility and traffic area.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a catchy, premium 2-sentence marketing description for a billboard located at ${billboard.location} in ${billboard.town}. The billboard type is ${billboard.type}. Highlight visibility and traffic.`,
    });
    return response.text || "High visibility location perfect for your brand.";
  } catch (e) {
    console.warn("AI Generation failed:", e);
    return "Premium advertising space available in high-traffic area.";
  }
};

export const generateRentalProposal = async (client: Client, billboard: Billboard, cost: number): Promise<string> => {
  if (!ai) return `Dear ${client.contactPerson},\n\nWe are pleased to offer you a space at ${billboard.location}. The monthly rate is $${cost}.\n\nBest regards,\nSpiritus Systems`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Draft a professional, persuasive email proposal to ${client.contactPerson} from ${client.companyName} for renting a billboard at ${billboard.location} (${billboard.town}). 
        The monthly rate is $${cost}. 
        Focus on value, visibility, and partnership. Keep it under 100 words.`,
    });
    return response.text || "Proposal generation failed.";
  } catch (e) {
    console.warn("AI Proposal failed:", e);
    return "Error generating proposal. Please try again later.";
  }
};

export const analyzeBusinessData = async (dataContext: string): Promise<string> => {
    if (!ai) return "AI Analysis unavailable. Please configure API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a business analyst for a Billboard Company. Analyze this data and give 3 bullet points of strategic advice: ${dataContext}`,
        });
        return response.text || "No insights available.";
    } catch (e) {
        return "Could not generate insights.";
    }
}