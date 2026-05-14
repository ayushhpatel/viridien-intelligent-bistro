import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MenuItem } from '../types';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<Props> = ({ item, onAdd }) => {
  return (
    <View className="flex-row bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
      <Image 
        source={{ uri: item.imageUrl }} 
        className="w-24 h-full bg-gray-200" 
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>{item.description}</Text>
        
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-base font-semibold text-gray-800">${item.price.toFixed(2)}</Text>
          <TouchableOpacity 
            className="bg-blue-600 px-4 py-2 rounded-full"
            onPress={() => onAdd(item)}
          >
            <Text className="text-white font-semibold text-sm">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
