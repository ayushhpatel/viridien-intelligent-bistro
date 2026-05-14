import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UIManager, Platform } from 'react-native';
import { MenuScreen } from './src/screens/MenuScreen';
import { CartScreen } from './src/screens/CartScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Menu"
            screenOptions={{
              headerStyle: { backgroundColor: '#ffffff' },
              headerShadowVisible: false,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen 
              name="Menu" 
              component={MenuScreen} 
              options={{ title: 'The Intelligent Bistro' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen} 
              options={{ 
                presentation: 'modal',
                title: 'Your Cart'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
