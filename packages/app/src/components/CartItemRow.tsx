import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CartItem } from '../types';

interface Props {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <View className="bg-white rounded-3xl p-4 mb-4 flex-row items-center shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100">
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
        <Text className="text-base font-bold text-gray-600">${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View className="flex-row items-center bg-gray-50 rounded-full p-1 border border-gray-100">
        <TouchableOpacity 
          className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
          onPress={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1) : onRemove(item.id)}
        >
          <Text className="text-gray-900 font-bold text-lg leading-5">-</Text>
        </TouchableOpacity>
        
        <Text className="mx-4 font-bold text-gray-900 text-base">{item.quantity}</Text>
        
        <TouchableOpacity 
          className="w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
          onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Text className="text-gray-900 font-bold text-lg leading-5">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
