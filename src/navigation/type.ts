import { StoredPaymentHistory } from '../shared/type/payment';
import { Product } from '../shared/type';

export type RootStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
  MainTab: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: {
    items?: Array<{ product: Product; quantity: number }>;
    totalPrice?: number;
  };
  EditProfile: undefined;
  OrderDetail: { order: StoredPaymentHistory };
};

export type MainTabParamList = {
  Products: undefined;
  OrderHistory: undefined;
  Profile: undefined;
};
