import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../shared/ui/color';
import ProfileScreen from '../features/main/ProfileScreen';
import ProductListScreen from '../features/product/ProductListScreen';
import OrderHistoryScreen from '../features/order/OrderHistoryScreen';
import { User, ShoppingBag, History } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

// 아이콘 컴포넌트들을 미리 정의
const ProductsIcon = ({ color, size }: { color: string; size: number }) => (
  <ShoppingBag size={size} color={color} />
);

const OrderHistoryIcon = ({ color, size }: { color: string; size: number }) => (
  <History size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <User size={size} color={color} />
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          borderBottomColor: '#E0E0E0',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: COLORS.primary,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
        options={{
          title: '상품',
          tabBarIcon: ProductsIcon,
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          title: '주문내역',
          tabBarIcon: OrderHistoryIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '마이페이지',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
