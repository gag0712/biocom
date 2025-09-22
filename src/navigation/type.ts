import { StoredPaymentHistory } from '../shared/type/payment';
import { Product } from '../shared/type';
import { ChallengeResult } from '../shared/type/challenge';

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
  ChallengeResult: { result: ChallengeResult };
};

export type MainTabParamList = {
  Products: undefined;
  OrderHistory: undefined;
  Challenge: undefined;
  Profile: undefined;
};
