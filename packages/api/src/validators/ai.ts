import { z } from 'zod';

export const ActionTypeEnum = z.enum(['ADD_ITEM', 'REMOVE_ITEM', 'UPDATE_QUANTITY', 'CLEAR_CART']);

export const ActionSchema = z.object({
  type: ActionTypeEnum,
  itemId: z.string().optional(), // optional because CLEAR_CART doesn't need an ID
  quantity: z.number().int().positive().optional() // optional for REMOVE_ITEM or CLEAR_CART
});

export const AIResponseSchema = z.object({
  reply: z.string().describe('The natural language response from the assistant'),
  actions: z.array(ActionSchema).describe('The structured cart mutations to perform')
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
export type ActionPayload = z.infer<typeof ActionSchema>;
