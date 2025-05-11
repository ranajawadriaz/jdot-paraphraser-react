
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your key
const ai = new GoogleGenerativeAI('AIzaSyC1fIyLMohJ2o0oGYmYblPoNwImI8k4aaI');

export async function paraphraseText(input: string): Promise<ReadableStream<string>> {
  try {
    // Set up the model and configuration
    const model = 'gemini-1.5-flash';
    const config = {
      responseMimeType: 'text/plain',
    };
    
    // Prepare the prompt contents
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Paraphrase this text to maintain the original meaning but use different wording. Keep the tone and style similar: ${input}`,
          },
        ],
      },
    ];

    // Generate the content stream
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Convert the response to a ReadableStream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(chunk.text);
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
