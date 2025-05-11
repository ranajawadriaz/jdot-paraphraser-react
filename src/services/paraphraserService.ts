
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your key
const ai = new GoogleGenerativeAI('AIzaSyC1fIyLMohJ2o0oGYmYblPoNwImI8k4aaI');

export async function paraphraseText(input: string): Promise<ReadableStream<string>> {
  try {
    // Set up the model
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Prepare the prompt
    const prompt = `Paraphrase this text to maintain the original meaning but use different wording. Keep the tone and style similar: ${input}`;

    // Generate content stream
    const result = await model.generateContentStream(prompt);
    
    // Convert the response to a ReadableStream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(text);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });
  } catch (error) {
    console.error('Error in paraphrasing:', error);
    throw new Error('Failed to paraphrase text');
  }
}
