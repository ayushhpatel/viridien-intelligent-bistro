import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { fetchMenu } from '../services/api';
import { sendChatMessage } from '../services/chat';
import { MenuItem } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onClose: () => void;
}

export const ChatInterface: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hi! I can help you order. What are you in the mood for?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
  const { data: menuItems = [] } = useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
  });

  const menuItemById = useMemo(() => {
    return menuItems.reduce<Record<string, MenuItem>>((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});
  }, [menuItems]);

  useEffect(() => {
    // Auto-scroll to bottom whenever messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, items);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response.reply 
      }]);

      const skippedActionMessages: string[] = [];
      const appliedCartItemIds = new Set(items.map(item => item.id));

      const addSkippedActionMessage = (message: string) => {
        if (!skippedActionMessages.includes(message)) {
          skippedActionMessages.push(message);
        }
      };

      response.actions.forEach(action => {
        switch (action.type) {
          case 'ADD_ITEM': {
            if (!action.itemId) {
              addSkippedActionMessage("I couldn't add that item because the menu item was missing from the assistant response.");
              break;
            }

            const menuItem = menuItemById[action.itemId];
            if (!menuItem) {
              addSkippedActionMessage(`I couldn't add "${action.itemId}" because it is not on the current menu.`);
              break;
            }

            addItem(menuItem, action.quantity ?? 1);
            appliedCartItemIds.add(action.itemId);
            break;
          }
          case 'REMOVE_ITEM': {
            if (!action.itemId) {
              addSkippedActionMessage("I couldn't remove that item because the menu item was missing from the assistant response.");
              break;
            }

            if (!menuItemById[action.itemId]) {
              addSkippedActionMessage(`I couldn't remove "${action.itemId}" because it is not on the current menu.`);
              break;
            }

            if (!appliedCartItemIds.has(action.itemId)) {
              addSkippedActionMessage(`I couldn't remove "${menuItemById[action.itemId].name}" because it is not in your cart.`);
              break;
            }

            removeItem(action.itemId);
            appliedCartItemIds.delete(action.itemId);
            break;
          }
          case 'UPDATE_QUANTITY': {
            if (!action.itemId || !action.quantity) {
              addSkippedActionMessage("I couldn't update that item because the assistant response was missing item or quantity details.");
              break;
            }

            if (!menuItemById[action.itemId]) {
              addSkippedActionMessage(`I couldn't update "${action.itemId}" because it is not on the current menu.`);
              break;
            }

            if (!appliedCartItemIds.has(action.itemId)) {
              addSkippedActionMessage(`I couldn't update "${menuItemById[action.itemId].name}" because it is not in your cart.`);
              break;
            }

            updateQuantity(action.itemId, action.quantity);
            break;
          }
          case 'CLEAR_CART':
            clearCart();
            appliedCartItemIds.clear();
            break;
        }
      });

      if (skippedActionMessages.length > 0) {
        setMessages(prev => [
          ...prev,
          ...skippedActionMessages.map((message, index) => ({
            id: `${Date.now()}-skipped-${index}`,
            role: 'assistant' as const,
            content: message
          }))
        ]);
      }

    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <Text className="text-xl font-black text-gray-900 tracking-tight">AI Assistant</Text>
        <TouchableOpacity 
          onPress={onClose}
          className="bg-gray-100 w-8 h-8 rounded-full items-center justify-center"
        >
          <Text className="text-gray-500 font-bold text-lg leading-5">×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View 
            key={msg.id} 
            className={`mb-6 max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
          >
            <View 
              className={`p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 rounded-tr-sm shadow-[0_2px_8px_rgba(37,99,235,0.2)]' 
                  : 'bg-white rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100'
              }`}
            >
              <Text className={`text-base leading-6 ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                {msg.content}
              </Text>
            </View>
          </View>
        ))}
        
        {isLoading && (
          <View className="self-start max-w-[85%] mb-6">
            <View className="p-4 bg-white rounded-3xl rounded-tl-sm shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 flex-row items-center space-x-2">
              <ActivityIndicator size="small" color="#9333ea" />
              <Text className="text-gray-500 text-sm ml-2 font-medium">Assistant is typing...</Text>
            </View>
          </View>
        )}
        <View className="h-6" />
      </ScrollView>

      <View className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] pb-8">
        <View className="flex-row items-end bg-gray-50 border border-gray-200 rounded-3xl px-4 py-2 min-h-[56px]">
          <TextInput 
            className="flex-1 text-base text-gray-900 max-h-32 pt-3 pb-3"
            value={input}
            onChangeText={setInput}
            placeholder="E.g. Add 2 bistro burgers..."
            placeholderTextColor="#9CA3AF"
            multiline
          />
          <TouchableOpacity 
            className={`w-10 h-10 rounded-full items-center justify-center mb-1 ml-2 ${input.trim() ? 'bg-blue-600' : 'bg-gray-200'}`}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Text className="text-white font-bold text-lg leading-5">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
