import { apiClient } from './api';

export interface AIAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  itemId?: string;
  quantity?: number;
}

export interface ChatResponse {
  reply: string;
  actions: AIAction[];
}

export const sendChatMessage = async (message: string, currentCart: any[]): Promise<ChatResponse> => {
  const response = await apiClient.post<ChatResponse>('/chat', {
    message,
    currentCart
  });
  return response.data;
};
