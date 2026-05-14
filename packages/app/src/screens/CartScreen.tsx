import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { CartItemRow } from '../components/CartItemRow';

export const CartScreen = ({ navigation }: any) => {
  const { items, updateQuantity, removeItem, clearCart, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-lg text-gray-500 mb-4">Your cart is empty</Text>
        <TouchableOpacity 
          className="bg-blue-600 px-6 py-3 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-bold">Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-4">
        {items.map(item => (
          <CartItemRow 
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
        
        <TouchableOpacity onPress={clearCart} className="mt-4 self-center">
          <Text className="text-red-500 font-semibold">Clear Cart</Text>
        </TouchableOpacity>
      </ScrollView>

      <View className="bg-white p-6 border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <View className="flex-row justify-between mb-4">
          <Text className="text-lg text-gray-600">Total</Text>
          <Text className="text-2xl font-bold text-gray-900">${getCartTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
