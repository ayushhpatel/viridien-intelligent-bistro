import axios from 'axios';

// Ensure to replace localhost with your actual network IP if testing on physical device
export const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});
