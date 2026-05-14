import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { CartItemRow } from '../components/CartItemRow';
import { ChatInterface } from '../components/ChatInterface';

export const CartScreen = ({ navigation }: any) => {
  const { items, updateQuantity, removeItem, getCartTotal, clearCart } = useCartStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleCheckout = () => {
    alert('Checkout successful!');
    clearCart();
    navigation.goBack();
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-6xl mb-6">🛒</Text>
        <Text className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your cart is empty</Text>
        <Text className="text-gray-500 text-center text-base mb-8">Looks like you haven't added anything to your order yet.</Text>
        <TouchableOpacity 
          className="bg-black px-8 py-4 rounded-2xl w-full items-center shadow-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-bold text-lg">Browse Menu</Text>
        </TouchableOpacity>
        
        {/* Floating AI Chat Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="absolute bottom-6 right-6 bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-[0_8px_30px_rgba(147,51,234,0.3)] border-2 border-white"
          onPress={() => setIsChatOpen(true)}
        >
          <Text className="text-white font-bold text-2xl">✨</Text>
        </TouchableOpacity>
        <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        </Modal>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {items.map(item => (
            <CartItemRow 
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          <View className="h-40" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white pt-4 pb-8 px-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-500 font-semibold text-base">Total</Text>
            <Text className="text-3xl font-black text-gray-900">${getCartTotal().toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.9}
            className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg w-full"
            onPress={handleCheckout}
          >
            <Text className="text-white font-bold text-lg tracking-wide">Checkout</Text>
          </TouchableOpacity>
        </View>

        {/* Floating AI Chat Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="absolute bottom-36 right-6 bg-purple-600 w-14 h-14 rounded-full items-center justify-center shadow-[0_8px_30px_rgba(147,51,234,0.3)] border-2 border-white"
          onPress={() => setIsChatOpen(true)}
        >
          <Text className="text-white font-bold text-xl">✨</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        <ChatInterface onClose={() => setIsChatOpen(false)} />
      </Modal>
    </>
  );
};
