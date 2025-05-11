
import { GoogleGenerativeAI } from '@google/generative-ai';

const ai = new GoogleGenerativeAI('AIzaSyC1fIyLMohJ2o0oGYmYblPoNwImI8k4aaI');

export async function paraphraseText(input: string): Promise<ReadableStream<string>> {
  const model = ai.getGenerativeModel({
    model: 'gemini-1.5-pro', // Using a supported model
  });

  const prompt = `Paraphrase this text to maintain the original meaning but use different wording. Keep the tone and style similar: ${input}`;

  try {
    const result = await model.generateContentStream(prompt);
    return createReadableStream(result);
  } catch (error) {
    console.error('Error in paraphrasing:', error);
    throw new Error('Failed to paraphrase text');
  }
}

function createReadableStream(responseStream: any): ReadableStream<string> {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of responseStream.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(text);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    }
  });
}
