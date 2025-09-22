import { storage } from './storage';
import { StoredPaymentHistory, PaymentReceipt } from '../type/payment';

const PAYMENT_HISTORY_KEY = 'payment_history';

export const savePaymentHistory = (email: string, receipt: PaymentReceipt): void => {
  try {
    const paymentHistory: StoredPaymentHistory = {
      id: receipt.orderId,
      email,
      receipt,
      createdAt: new Date().toISOString(),
    };

    // 기존 결제 내역 가져오기
    const existingHistory = getPaymentHistory();
    
    // 새로운 결제 내역 추가 (최신순으로 정렬)
    const updatedHistory = [paymentHistory, ...existingHistory];
    
    // MMKV에 저장
    storage.set(PAYMENT_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    console.log('Payment history saved successfully:', paymentHistory.id);
  } catch (error) {
    console.error('Failed to save payment history:', error);
  }
};

export const getPaymentHistory = (): StoredPaymentHistory[] => {
  try {
    const historyJson = storage.getString(PAYMENT_HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    return [];
  } catch (error) {
    console.error('Failed to get payment history:', error);
    return [];
  }
};

export const getPaymentHistoryByEmail = (email: string): StoredPaymentHistory[] => {
  try {
    const allHistory = getPaymentHistory();
    return allHistory.filter(payment => 
      payment.email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Failed to get payment history by email:', error);
    return [];
  }
};

export const getPaymentById = (id: string): StoredPaymentHistory | null => {
  try {
    const allHistory = getPaymentHistory();
    return allHistory.find(payment => payment.id === id) || null;
  } catch (error) {
    console.error('Failed to get payment by id:', error);
    return null;
  }
};

export const clearPaymentHistory = (): void => {
  try {
    storage.delete(PAYMENT_HISTORY_KEY);
    console.log('Payment history cleared successfully');
  } catch (error) {
    console.error('Failed to clear payment history:', error);
  }
};
