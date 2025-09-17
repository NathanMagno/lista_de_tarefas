import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../src/context/themeContext';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{ title: 'Tela de Login', headerShown: false }}
          />
          <Stack.Screen
            name="home/index"
            options={{ title: 'Minhas Tarefas', headerShown: false }}
          />
          <Stack.Screen
            name="home/filmes"
            options={{ title: 'Lista de Filmes', headerShown: false}}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}