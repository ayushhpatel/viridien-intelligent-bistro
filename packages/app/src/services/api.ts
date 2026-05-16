import axios from 'axios';
import { Platform } from 'react-native';
import { z } from 'zod';
import { MenuItem } from '../types';

const MenuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  category: z.enum(['Burgers & Sandwiches', 'Sides', 'Drinks', 'Desserts']),
  imageUrl: z.string(),
});

const MenuResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(MenuItemSchema),
});

const localApiUrl = Platform.select({
  android: 'http://10.0.2.2:3001/api',
  default: 'http://localhost:3001/api',
});

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || localApiUrl,
});

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const response = await apiClient.get<unknown>('/menu');
  const parsedResponse = MenuResponseSchema.safeParse(response.data);

  if (!parsedResponse.success) {
    throw new Error('Failed to fetch menu');
  }

  return parsedResponse.data.data;
};
