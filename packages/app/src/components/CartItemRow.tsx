import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CartItem } from '../types';

interface Props {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-xl shadow-sm border border-gray-100">
      <View className="flex-1 mr-4">
        <Text className="text-base font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View className="flex-row items-center bg-gray-100 rounded-full">
        <TouchableOpacity 
          className="w-8 h-8 items-center justify-center"
          onPress={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1) : onRemove(item.id)}
        >
          <Text className="text-lg font-bold text-gray-600">-</Text>
        </TouchableOpacity>
        
        <Text className="text-base font-semibold px-2">{item.quantity}</Text>
        
        <TouchableOpacity 
          className="w-8 h-8 items-center justify-center"
          onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Text className="text-lg font-bold text-gray-600">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
