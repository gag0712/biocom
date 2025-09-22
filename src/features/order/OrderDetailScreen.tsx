import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/type';
import { COLORS } from '../../shared/ui/color';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const OrderDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'OrderDetail'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { order } = route.params;
  const { top, bottom } = useSafeAreaInsets();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'failed':
        return COLORS.error;
      default:
        return COLORS.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'pending':
        return '처리중';
      case 'failed':
        return '실패';
      default:
        return '알 수 없음';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card':
        return '카드';
      case 'bank':
        return '계좌이체';
      case 'kakao':
        return '카카오페이';
      default:
        return method;
    }
  };

  const { receipt } = order;

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문 상세</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 주문 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>주문 정보</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주문번호</Text>
              <Text style={styles.infoValue}>{receipt.orderNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주문일시</Text>
              <Text style={styles.infoValue}>
                {formatDate(receipt.orderDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>주문상태</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(receipt.paymentStatus) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(receipt.paymentStatus)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 주문 상품 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>주문 상품</Text>
          </View>
          <View style={styles.infoCard}>
            {receipt.items.map((item, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productQuantity}>
                    수량: {item.quantity}개
                  </Text>
                </View>
                <Text style={styles.productPrice}>
                  {(item.price * item.quantity).toLocaleString()}원
                </Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>총 주문금액</Text>
              <Text style={styles.totalPrice}>
                {receipt.totalAmount.toLocaleString()}원
              </Text>
            </View>
          </View>
        </View>

        {/* 배송 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>배송 정보</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>받는 사람</Text>
              <Text style={styles.infoValue}>{receipt.deliveryInfo.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>연락처</Text>
              <Text style={styles.infoValue}>{receipt.deliveryInfo.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>배송주소</Text>
              <Text style={styles.infoValue}>
                {receipt.deliveryInfo.address}
              </Text>
            </View>
          </View>
        </View>

        {/* 결제 정보 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>결제 정보</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>결제수단</Text>
              <Text style={styles.infoValue}>
                {getPaymentMethodText(receipt.paymentMethod)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>결제금액</Text>
              <Text style={styles.infoValue}>
                {receipt.totalAmount.toLocaleString()}원
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>결제상태</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(receipt.paymentStatus) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(receipt.paymentStatus)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
});

export default OrderDetailScreen;
