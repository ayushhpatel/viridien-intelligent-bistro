import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '../services/api';
import { sendChatMessage } from '../services/chat';
import { useCartStore } from '../store/useCartStore';

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
    { id: '1', role: 'assistant', content: 'Hi! I am your Intelligent Bistro assistant. What can I get started for you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: menuItems } = useQuery({ queryKey: ['menu'], queryFn: fetchMenu });
  const cartItems = useCartStore(state => state.items);
  const { addItem, removeItem, updateQuantity, clearCart } = useCartStore.getState();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Optimistic UI
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, cartItems);

      // Apply Cart Mutations
      if (response.actions && menuItems) {
        response.actions.forEach(action => {
          if (action.type === 'ADD_ITEM' && action.itemId) {
            const item = menuItems.find(m => m.id === action.itemId);
            if (item) addItem(item, action.quantity || 1);
          } else if (action.type === 'REMOVE_ITEM' && action.itemId) {
            removeItem(action.itemId);
          } else if (action.type === 'UPDATE_QUANTITY' && action.itemId && action.quantity !== undefined) {
            updateQuantity(action.itemId, action.quantity);
          } else if (action.type === 'CLEAR_CART') {
            clearCart();
          }
        });
      }

      // Add assistant reply
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I couldn't connect to the server right now. Please try again."
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
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200 pt-12 shadow-sm z-10">
        <Text className="text-xl font-bold text-gray-900">Bistro Assistant</Text>
        <TouchableOpacity onPress={onClose} className="bg-gray-100 px-3 py-1.5 rounded-full">
          <Text className="text-gray-600 font-semibold text-sm">Close</Text>
        </TouchableOpacity>
      </View>

      {/* Chat History */}
      <ScrollView 
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map(msg => (
          <View 
            key={msg.id} 
            className={`mb-4 max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 self-end rounded-tr-sm' 
                : 'bg-white self-start rounded-tl-sm shadow-sm border border-gray-100'
            }`}
          >
            <Text className={`text-base ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
              {msg.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View className="bg-white self-start rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100 mb-4">
            <ActivityIndicator size="small" color="#2563eb" />
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="p-4 bg-white border-t border-gray-200 flex-row items-center pb-8">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-5 py-3.5 text-base text-gray-900 mr-3 border border-gray-200"
          placeholder="e.g., Add 2 burgers and a coke..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          editable={!isLoading}
          returnKeyType="send"
        />
        <TouchableOpacity 
          className={`w-12 h-12 rounded-full items-center justify-center ${
            inputText.trim() && !isLoading ? 'bg-blue-600' : 'bg-blue-300'
          }`}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text className="text-white font-bold text-lg">↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
