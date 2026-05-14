import { create } from 'zustand';

interface CartState {
  items: any[];
  addItem: (item: any) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
