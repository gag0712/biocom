import { useQuery } from '@tanstack/react-query';
import { fetchOrderHistory } from './api';
import { StoredPaymentHistory } from '../../type/payment';

// 주문 내역 조회를 위한 useQuery hook
export const useOrderHistory = (searchQuery?: string, userEmail?: string) => {
  return useQuery<StoredPaymentHistory[], Error>({
    queryKey: ['orderHistory', searchQuery, userEmail],
    queryFn: () => fetchOrderHistory(searchQuery, userEmail),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// 특정 주문 상세 조회를 위한 hook (필요시 사용)
export const useOrderDetail = (orderId: string, userEmail?: string) => {
  return useQuery<StoredPaymentHistory | undefined, Error>({
    queryKey: ['orderDetail', orderId, userEmail],
    queryFn: async () => {
      const orders = await fetchOrderHistory(undefined, userEmail);
      return orders.find(order => order.id === orderId);
    },
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
