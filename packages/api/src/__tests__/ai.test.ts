import { AIResponseSchema, ChatRequestSchema } from '../validators/ai';

describe('AI Zod Parser Validation', () => {
  it('should successfully parse a valid AI response', () => {
    const validPayload = {
      reply: "Sure, adding 2 burgers to your cart.",
      actions: [
        {
          type: "ADD_ITEM",
          itemId: "bistro_burger",
          quantity: 2
        }
      ]
    };
    
    const result = AIResponseSchema.parse(validPayload);
    expect(result.reply).toBe("Sure, adding 2 burgers to your cart.");
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].type).toBe("ADD_ITEM");
    expect(result.actions[0].quantity).toBe(2);
  });

  it('should reject malformed AI actions (missing type)', () => {
    const invalidPayload = {
      reply: "Oops",
      actions: [
        {
          itemId: "bistro_burger"
        }
      ]
    };
    
    expect(() => AIResponseSchema.parse(invalidPayload)).toThrow();
  });

  it('should allow clearing cart without item IDs', () => {
    const validPayload = {
      reply: "Cart cleared.",
      actions: [
        {
          type: "CLEAR_CART"
        }
      ]
    };
    
    const result = AIResponseSchema.parse(validPayload);
    expect(result.actions[0].type).toBe("CLEAR_CART");
    expect(result.actions[0].itemId).toBeUndefined();
  });

  it('should reject add actions without a menu item ID', () => {
    const invalidPayload = {
      reply: "Adding that now.",
      actions: [
        {
          type: "ADD_ITEM",
          quantity: 1
        }
      ]
    };

    expect(() => AIResponseSchema.parse(invalidPayload)).toThrow();
  });

  it('should validate chat requests with optional cart state', () => {
    const validPayload = {
      message: "Add fries",
      currentCart: [
        {
          id: "bistro_burger",
          name: "The Bistro Burger",
          quantity: 1,
          price: 14.5
        }
      ]
    };

    const result = ChatRequestSchema.parse(validPayload);
    expect(result.message).toBe("Add fries");
    expect(result.currentCart).toHaveLength(1);
  });
});
