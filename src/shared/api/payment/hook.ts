import { useMutation } from '@tanstack/react-query';
import { processPayment } from './api';
import { PaymentRequest, PaymentResponse } from '../../type/payment';

export const usePayment = () => {
  return useMutation<PaymentResponse, Error, PaymentRequest>({
    mutationFn: processPayment,
    onSuccess: data => {
      console.log('Payment successful:', data);
    },
    onError: error => {
      console.error('Payment failed:', error);
    },
  });
};
