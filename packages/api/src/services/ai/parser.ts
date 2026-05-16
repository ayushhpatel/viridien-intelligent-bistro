import OpenAI from 'openai';
import { generateSystemPrompt } from '../../prompts/system';
import { AIResponseSchema } from '../../validators/ai';
import type { AIResponse, ChatCartItem } from '../../validators/ai';

export const parseChatRequest = async (message: string, currentCart: ChatCartItem[]): Promise<AIResponse> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.GEMINI_API_URL || process.env.OPENAI_API_URL;
  const model = process.env.GEMINI_API_MODEL
    || process.env.OPENAI_API_MODEL
    || (process.env.GEMINI_API_KEY ? 'gemini-1.5-flash' : 'gpt-4o-mini');

  if (!apiKey) {
    return {
      reply: "I am currently running in mock mode because no AI API key was provided. I cannot process your request.",
      actions: []
    };
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: apiUrl ? apiUrl.replace(/\/chat\/completions\/?$/, '/') : undefined
  });

  try {
    const systemPrompt = generateSystemPrompt(currentCart);

    const completion = await openai.chat.completions.create({
      model,
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

    const parsedJson: unknown = JSON.parse(rawContent);

    return AIResponseSchema.parse(parsedJson);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return {
      reply: "I'm sorry, I'm having trouble processing that right now. Please try again or add items manually.",
      actions: []
    };
  }
};
