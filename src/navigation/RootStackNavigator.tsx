import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './type';
import SignInScreen from '../features/signUp/SignInScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
