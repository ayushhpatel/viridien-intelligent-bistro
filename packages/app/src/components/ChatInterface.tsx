import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useCartStore } from '../store/useCartStore';
import { sendChatMessage } from '../services/chat';

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

      response.actions.forEach(action => {
        switch (action.type) {
          case 'ADD_ITEM':
            const menuItem = { 
              id: action.itemId!, 
              name: action.itemId!.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              price: 10.99, // Fallback price
              description: '',
              category: 'Added via AI',
            };
            addItem(menuItem, action.quantity || 1);
            break;
          case 'REMOVE_ITEM':
            if (action.itemId) removeItem(action.itemId);
            break;
          case 'UPDATE_QUANTITY':
            if (action.itemId && action.quantity) updateQuantity(action.itemId, action.quantity);
            break;
          case 'CLEAR_CART':
            clearCart();
            break;
        }
      });

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
