import { apiClient } from './api';
import { z } from 'zod';
import { CartItem } from '../types';

const AIActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('ADD_ITEM'),
    itemId: z.string().min(1),
    quantity: z.number().int().positive().default(1),
  }),
  z.object({
    type: z.literal('REMOVE_ITEM'),
    itemId: z.string().min(1),
  }),
  z.object({
    type: z.literal('UPDATE_QUANTITY'),
    itemId: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
  z.object({
    type: z.literal('CLEAR_CART'),
  }),
]);

const ChatResponseSchema = z.object({
  reply: z.string().min(1),
  actions: z.array(AIActionSchema),
});

export type AIAction = z.infer<typeof AIActionSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

export const sendChatMessage = async (message: string, currentCart: CartItem[]): Promise<ChatResponse> => {
  const response = await apiClient.post<unknown>('/chat', {
    message,
    currentCart
  });

  const parsedResponse = ChatResponseSchema.safeParse(response.data);
  if (!parsedResponse.success) {
    throw new Error('Invalid chat response');
  }

  return parsedResponse.data;
};
