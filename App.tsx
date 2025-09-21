import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/RootStackNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
