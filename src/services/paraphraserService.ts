
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your key
const apiKey = import.meta.env.VITE_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

export async function paraphraseText(input: string): Promise<string> {
  try {
    // Set up the model
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare the prompt
    const prompt = `Paraphrase this text to maintain the original meaning but use different wording. Keep the tone and style similar: ${input}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in paraphrasing:', error);
    throw new Error('Failed to paraphrase text');
  }
}
