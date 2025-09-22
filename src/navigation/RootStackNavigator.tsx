import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './type';
import SignInScreen from '../features/signUp/SignInScreen';
import SignUpScreen from '../features/signUp/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import ProductDetailScreen from '../features/product/ProductDetailScreen';
import CartScreen from '../features/cart/CartScreen';
import CheckoutScreen from '../features/checkout/CheckoutScreen';
import EditProfileScreen from '../features/main/EditProfileScreen';
import OrderDetailScreen from '../features/order/OrderDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
