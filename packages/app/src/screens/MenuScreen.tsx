import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../services/api';
import { MenuItemCard } from '../components/MenuItemCard';
import { useCartStore } from '../store/useCartStore';
import { MenuItem } from '../types';
import { ChatInterface } from '../components/ChatInterface';

const MenuSkeleton = () => (
  <View className="px-4 pt-4">
    {[1, 2, 3].map((i) => (
      <View key={i} className="mb-8">
        <View className="h-6 w-32 bg-gray-200 rounded-md mb-4 opacity-50" />
        {[1, 2].map((j) => (
          <View key={j} className="bg-white rounded-3xl p-4 mb-4 flex-row shadow-sm border border-gray-100 items-center">
            <View className="flex-1 pr-4">
              <View className="h-5 w-3/4 bg-gray-200 rounded-md mb-2 opacity-50" />
              <View className="h-4 w-full bg-gray-200 rounded-md mb-1 opacity-50" />
              <View className="h-4 w-1/2 bg-gray-200 rounded-md mt-2 opacity-50" />
            </View>
            <View className="w-24 h-24 bg-gray-200 rounded-2xl opacity-50" />
          </View>
        ))}
      </View>
    ))}
  </View>
);

export const MenuScreen = ({ navigation }: any) => {
  const { data: menuItems, isLoading, isError } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const cartCount = useCartStore(state => state.getCartCount());

  const groupedMenu = useMemo(() => {
    if (!menuItems) return {};
    return menuItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [menuItems]);

  if (isLoading) {
    return <View className="flex-1 bg-gray-50"><MenuSkeleton /></View>;
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-4xl mb-4">🍽️</Text>
        <Text className="text-xl font-bold text-gray-900 mb-2">Menu Unavailable</Text>
        <Text className="text-gray-500 text-center">We couldn't connect to the kitchen. Please check your connection and try again.</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-4 pt-2">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <View key={category} className="mb-6 pt-4">
              <Text className="text-2xl font-black text-gray-900 tracking-tight mb-4">{category}</Text>
              {items.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAdd={(selectedItem) => addItem(selectedItem)} 
                />
              ))}
            </View>
          ))}
          <View className="h-32" />
        </ScrollView>

        {cartCount > 0 && (
          <View className="absolute bottom-24 left-4 right-4">
            <TouchableOpacity 
              activeOpacity={0.9}
              className="bg-black p-4 rounded-2xl shadow-xl flex-row justify-between items-center"
              onPress={() => navigation.navigate('Cart')}
            >
              <View className="bg-gray-800 rounded-full w-8 h-8 items-center justify-center">
                <Text className="text-white font-bold">{cartCount}</Text>
              </View>
              <Text className="text-white font-bold text-lg tracking-tight">View Cart</Text>
              <Text className="text-white font-bold">${useCartStore.getState().getCartTotal().toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Floating AI Chat Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="absolute bottom-6 right-6 bg-purple-600 w-16 h-16 rounded-full items-center justify-center shadow-[0_8px_30px_rgba(147,51,234,0.3)] border-2 border-white"
          onPress={() => setIsChatOpen(true)}
        >
          <Text className="text-white font-bold text-2xl">✨</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        <ChatInterface onClose={() => setIsChatOpen(false)} />
      </Modal>
    </>
  );
};
