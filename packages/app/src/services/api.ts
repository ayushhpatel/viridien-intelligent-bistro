import axios from 'axios';
import { MenuItem } from '../types';

// Depending on the environment, localhost might need to be an IP address
// Usually for Expo Go on a physical device, this needs to be your network IP
// e.g. 'http://192.168.1.100:3001/api'
export const apiClient = axios.create({
  baseURL: 'https://e11e9447b95941.lhr.life/api',
});

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}

export const fetchMenu = async (): Promise<MenuItem[]> => {
  const response = await apiClient.get<MenuResponse>('/menu');
  if (!response.data.success) {
    throw new Error('Failed to fetch menu');
  }
  return response.data.data;
};
