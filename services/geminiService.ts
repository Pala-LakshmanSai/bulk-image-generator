import { GoogleGenAI } from "@google/genai";

export async function generateImageFromPrompt(prompt: string): Promise<{data: string, mimeType: string}> {
  // FIX: Create a new GoogleGenAI instance on each call to ensure the latest API key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // FIX: Use generateImages with imagen-4.0-generate-001 for higher quality and aspect ratio control.
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const image = response.generatedImages[0];
        if (image.image?.imageBytes) {
            return { data: image.image.imageBytes, mimeType: 'image/jpeg' };
        }
    }
    
    throw new Error("No image data received from API.");
  } catch (error) {
    console.error(`Error generating image for prompt "${prompt}":`, error);
    // Re-throw the original error to be handled by the UI component
    throw error;
  }
}