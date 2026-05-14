import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../services/api';
import { MenuItemCard } from '../components/MenuItemCard';
import { useCartStore } from '../store/useCartStore';
import { MenuCategory, MenuItem } from '../types';

export const MenuScreen = ({ navigation }: any) => {
  const { data: menuItems, isLoading, isError } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  });

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
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-red-500 text-lg">Failed to load menu.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-4">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <View key={category} className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-3">{category}</Text>
            {items.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onAdd={(selectedItem) => addItem(selectedItem)} 
              />
            ))}
          </View>
        ))}
        <View className="h-24" />
      </ScrollView>

      {cartCount > 0 && (
        <View className="absolute bottom-6 left-4 right-4">
          <TouchableOpacity 
            className="bg-blue-600 p-4 rounded-xl shadow-lg flex-row justify-between items-center"
            onPress={() => navigation.navigate('Cart')}
          >
            <View className="bg-blue-800 rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white font-bold">{cartCount}</Text>
            </View>
            <Text className="text-white font-bold text-lg">View Cart</Text>
            <Text className="text-white font-bold">${useCartStore.getState().getCartTotal().toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
