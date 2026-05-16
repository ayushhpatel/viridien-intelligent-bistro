import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MenuItem } from '../types';

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<Props> = React.memo(({ item, onAdd }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      className="bg-white rounded-3xl p-4 mb-4 flex-row shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 items-center"
      onPress={() => onAdd(item)}
    >
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
        {item.description && (
          <Text className="text-gray-500 text-sm mb-3 leading-5" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</Text>
      </View>

      <View className="items-center justify-center">
        <View className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden items-center justify-center">
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-gray-300 text-xs">No Image</Text>
          )}
        </View>
        <View className="absolute -bottom-2 bg-blue-600 px-4 py-1.5 rounded-full shadow-sm">
          <Text className="text-white font-bold text-xs">ADD</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
