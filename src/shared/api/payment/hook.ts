import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processPayment } from './api';
import { PaymentRequest, PaymentResponse } from '../../type/payment';
import { savePaymentHistory } from '../../services/paymentStorage';

export const usePayment = (userEmail?: string) => {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, Error, PaymentRequest>({
    mutationFn: processPayment,
    onSuccess: data => {
      console.log('Payment successful:', data);

      // 결제 성공 시 주문 내역을 MMKV에 저장
      if (data.success && userEmail) {
        savePaymentHistory(userEmail, data.receipt);

        // 주문 내역 쿼리 invalidate하여 최신 데이터로 업데이트
        queryClient.invalidateQueries({
          queryKey: ['orderHistory'],
        });

        console.log('Order history invalidated and updated');
      }
    },
    onError: error => {
      console.error('Payment failed:', error);
    },
  });
};
