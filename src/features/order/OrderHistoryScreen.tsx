import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { COLORS } from '../../shared/ui/color';
import { StoredPaymentHistory } from '../../shared/type/payment';
import { Search, Package, MapPin, CreditCard } from 'lucide-react-native';
import { useOrderHistory } from '../../shared/api/order/hook';
import { useAuthStore } from '../../shared/store/authStore';

const OrderHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const {
    data: orderHistory,
    isLoading,
    refetch,
  } = useOrderHistory(searchQuery, user?.email);

  // 화면에 포커스될 때마다 데이터 refetch
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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

  const renderOrderItem = ({ item }: { item: StoredPaymentHistory }) => {
    const { receipt } = item;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          Alert.alert(
            '주문 상세',
            `주문번호: ${receipt.orderNumber}\n주문일: ${formatDate(
              receipt.orderDate,
            )}\n총 금액: ${receipt.totalAmount.toLocaleString()}원`,
            [{ text: '확인' }],
          );
        }}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{receipt.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {formatDate(receipt.orderDate)}
            </Text>
          </View>
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

        <View style={styles.itemsContainer}>
          {receipt.items.map((orderItem, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{orderItem.productName}</Text>
              <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
              <Text style={styles.itemPrice}>
                {orderItem.price.toLocaleString()}원
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.deliveryInfo}>
            <MapPin size={16} color={COLORS.secondary} />
            <Text style={styles.deliveryText}>{receipt.deliveryInfo.name}</Text>
          </View>
          <View style={styles.paymentInfo}>
            <CreditCard size={16} color={COLORS.secondary} />
            <Text style={styles.paymentText}>
              {getPaymentMethodText(receipt.paymentMethod)}
            </Text>
          </View>
          <Text style={styles.totalAmount}>
            {receipt.totalAmount.toLocaleString()}원
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Package size={64} color={COLORS.secondary} />
      <Text style={styles.emptyTitle}>주문 내역이 없습니다</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? '검색 결과가 없습니다' : '아직 주문한 상품이 없습니다'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="상품명으로 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.secondary}
        />
      </View>

      <FlatList
        data={orderHistory || []}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[COLORS.accent]}
            tintColor={COLORS.accent}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.secondary,
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
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primary,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.secondary,
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginLeft: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;
