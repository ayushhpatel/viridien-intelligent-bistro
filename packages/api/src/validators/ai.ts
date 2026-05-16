import { z } from 'zod';

export const ActionTypeEnum = z.enum(['ADD_ITEM', 'REMOVE_ITEM', 'UPDATE_QUANTITY', 'CLEAR_CART']);

export const CartItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
}).passthrough();

export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  currentCart: z.array(CartItemSchema).optional().default([]),
});

export const AddItemActionSchema = z.object({
  type: z.literal('ADD_ITEM'),
  itemId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export const RemoveItemActionSchema = z.object({
  type: z.literal('REMOVE_ITEM'),
  itemId: z.string().min(1),
});

export const UpdateQuantityActionSchema = z.object({
  type: z.literal('UPDATE_QUANTITY'),
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const ClearCartActionSchema = z.object({
  type: z.literal('CLEAR_CART'),
});

export const ActionSchema = z.discriminatedUnion('type', [
  AddItemActionSchema,
  RemoveItemActionSchema,
  UpdateQuantityActionSchema,
  ClearCartActionSchema,
]);

export const AIResponseSchema = z.object({
  reply: z.string().min(1).describe('The natural language response from the assistant'),
  actions: z.array(ActionSchema).describe('The structured cart mutations to perform')
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatCartItem = z.infer<typeof CartItemSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;
export type ActionPayload = z.infer<typeof ActionSchema>;
