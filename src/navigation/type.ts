export type RootStackParamList = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
  MainTab: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: {
    items?: Array<{ product: any; quantity: number }>;
    totalPrice?: number;
  };
};

export type MainTabParamList = {
  Products: undefined;
  Profile: undefined;
};
