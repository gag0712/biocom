export interface PaymentItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PaymentRequest {
  items: PaymentItem[];
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  paymentMethod: 'card' | 'bank' | 'kakao';
  totalAmount: number;
  deliveryFee: number;
}

export interface PaymentReceipt {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  items: PaymentItem[];
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  paymentMethod: 'card' | 'bank' | 'kakao';
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: 'completed' | 'pending' | 'failed';
  estimatedDelivery: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  receipt: PaymentReceipt;
}

export interface StoredPaymentHistory {
  id: string;
  email: string;
  receipt: PaymentReceipt;
  createdAt: string;
}
