import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/RootStackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </KeyboardProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
