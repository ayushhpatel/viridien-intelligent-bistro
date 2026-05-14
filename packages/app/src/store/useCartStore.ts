import { create } from 'zustand';
import { CartState, MenuItem } from '../types';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item: MenuItem, quantity: number = 1) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + quantity } 
            : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity }] };
  }),

  removeItem: (itemId: string) => set((state) => ({
    items: state.items.filter(i => i.id !== itemId)
  })),

  updateQuantity: (itemId: string, quantity: number) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter(i => i.id !== itemId) };
    }
    return {
      items: state.items.map(i => 
        i.id === itemId 
          ? { ...i, quantity } 
          : i
      )
    };
  }),

  clearCart: () => set({ items: [] }),

  getCartCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
