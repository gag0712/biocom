import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './src/navigation/RootStackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
