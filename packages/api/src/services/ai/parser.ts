import OpenAI from 'openai';
import { generateSystemPrompt } from '../../prompts/system';
import { AIResponse, AIResponseSchema } from '../../validators/ai';

export const parseChatRequest = async (message: string, currentCart: any[]): Promise<AIResponse> => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("WARNING: OPENAI_API_KEY is not set. Returning mocked AI response.");
    return {
      reply: "I am currently running in mock mode because no OpenAI API key was provided. I cannot process your request.",
      actions: []
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL ? process.env.OPENAI_API_URL.replace(/\/chat\/completions\/?$/, '/') : undefined
  });

  try {
    const systemPrompt = generateSystemPrompt(currentCart);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const rawContent = completion.choices[0]?.message.content;

    if (!rawContent) {
      throw new Error("Failed to parse AI response");
    }

    const parsedJson = JSON.parse(rawContent);

    return AIResponseSchema.parse(parsedJson);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return {
      reply: "I'm sorry, I'm having trouble processing that right now. Please try again or add items manually.",
      actions: []
    };
  }
};
