import {
  getPaymentHistory,
  getPaymentHistoryByEmail,
} from '../../services/paymentStorage';
import { StoredPaymentHistory } from '../../type/payment';

// 주문 내역 조회 (실제 결제 내역에서 가져오기)
export const getOrderHistory = (userEmail?: string): StoredPaymentHistory[] => {
  try {
    if (userEmail) {
      return getPaymentHistoryByEmail(userEmail);
    }
    return getPaymentHistory();
  } catch (error) {
    console.error('주문 내역 조회 실패:', error);
    throw new Error('주문 내역 조회에 실패했습니다.');
  }
};

// 검색어로 주문 내역 필터링
export const searchOrderHistory = (
  searchQuery: string,
  userEmail?: string,
): StoredPaymentHistory[] => {
  try {
    const allOrders = getOrderHistory(userEmail);

    if (!searchQuery.trim()) {
      return allOrders;
    }

    const query = searchQuery.toLowerCase().trim();

    return allOrders.filter(order => {
      return order.receipt.items.some(item =>
        item.productName.toLowerCase().includes(query),
      );
    });
  } catch (error) {
    console.error('주문 내역 검색 실패:', error);
    throw new Error('주문 내역 검색에 실패했습니다.');
  }
};

// Mock API 응답 시뮬레이션을 위한 지연 함수
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

// API 형태로 주문 내역 조회 (useQuery용)
export const fetchOrderHistory = async (
  searchQuery?: string,
  userEmail?: string,
): Promise<StoredPaymentHistory[]> => {
  try {
    // 네트워크 지연 시뮬레이션
    await delay(300);

    if (searchQuery) {
      return searchOrderHistory(searchQuery, userEmail);
    }

    return getOrderHistory(userEmail);
  } catch (error) {
    console.error('주문 내역 API 호출 실패:', error);
    throw new Error('주문 내역을 불러오는데 실패했습니다.');
  }
};
