import { PaymentRequest, PaymentResponse } from '../../type/payment';

// Mock 결제 API
export const processPayment = async (
  paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise<void>(resolve => setTimeout(resolve, 2000));

  // 랜덤하게 성공/실패 결정 (90% 성공률)
  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    return {
      success: false,
      message: '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      receipt: {} as any,
    };
  }

  // 주문 ID 생성
  const orderId = `ORDER_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 11)}`;
  const orderNumber = `BIOC${Date.now().toString().slice(-8)}`;

  // 주문 날짜
  const orderDate = new Date().toISOString();

  // 배송 예상일 계산 (3-5일)
  const deliveryDays = Math.floor(Math.random() * 3) + 3;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

  const receipt = {
    orderId,
    orderNumber,
    orderDate,
    items: paymentData.items,
    deliveryInfo: paymentData.deliveryInfo,
    paymentMethod: paymentData.paymentMethod,
    subtotal: paymentData.totalAmount - paymentData.deliveryFee,
    deliveryFee: paymentData.deliveryFee,
    totalAmount: paymentData.totalAmount,
    paymentStatus: 'completed' as const,
    estimatedDelivery: estimatedDelivery.toISOString(),
  };

  return {
    success: true,
    message: '결제가 성공적으로 완료되었습니다.',
    receipt,
  };
};
