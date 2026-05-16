import { useCartStore } from '../store/useCartStore';

const mockMenuItem = {
  id: 'bistro_burger',
  name: 'Bistro Burger',
  price: 14.99,
  description: 'A delicious burger',
  category: 'Burgers & Sandwiches' as const,
  imageUrl: ''
};

describe('Cart Store Logic', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add items to the cart correctly', () => {
    useCartStore.getState().addItem(mockMenuItem, 2);
    
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('bistro_burger');
    expect(items[0].quantity).toBe(2);
  });

  it('should update item quantities', () => {
    useCartStore.getState().addItem(mockMenuItem, 1);
    useCartStore.getState().updateQuantity('bistro_burger', 5);
    
    const items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(5);
  });

  it('should correctly calculate total price', () => {
    useCartStore.getState().addItem(mockMenuItem, 2); // 14.99 * 2 = 29.98
    
    const total = useCartStore.getState().getCartTotal();
    expect(total).toBeCloseTo(29.98);
  });

  it('should remove items completely', () => {
    useCartStore.getState().addItem(mockMenuItem, 1);
    useCartStore.getState().removeItem('bistro_burger');
    
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
