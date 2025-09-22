import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';
import { COLORS } from '../../shared/ui/color';
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../shared/store/cartStore';
import { useAuthStore } from '../../shared/store/authStore';
import { usePayment } from '../../shared/api/payment/hook';
import { PaymentRequest } from '../../shared/type/payment';
import { savePaymentHistory } from '../../shared/services/paymentStorage';

const CheckoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { top, bottom } = useSafeAreaInsets();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const paymentMutation = usePayment();

  // ScrollView와 입력 필드 refs
  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const zipCodeInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const detailAddressInputRef = useRef<TextInput>(null);

  // 각 입력 필드 컨테이너 refs
  const nameContainerRef = useRef<View>(null);
  const phoneContainerRef = useRef<View>(null);
  const zipCodeContainerRef = useRef<View>(null);
  const addressContainerRef = useRef<View>(null);
  const detailAddressContainerRef = useRef<View>(null);

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'kakao'>(
    'card',
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const scrollToInput = (
    inputRef: React.RefObject<TextInput | null>,
    containerRef: React.RefObject<View | null>,
  ) => {
    setTimeout(() => {
      inputRef.current?.focus();

      // 컨테이너의 위치를 측정하여 정확한 스크롤 위치 계산
      if (containerRef.current && scrollViewRef.current) {
        containerRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: Math.max(0, y - 100), // 상단 여백 100px 확보
              animated: true,
            });
          },
          () => {
            // 측정 실패 시 기본 위치로 스크롤
            scrollViewRef.current?.scrollTo({
              y: 300,
              animated: true,
            });
          },
        );
      } else {
        // ref가 없는 경우 기본 위치로 스크롤
        scrollViewRef.current?.scrollTo({
          y: 300,
          animated: true,
        });
      }
    }, 100);
  };

  const validateAndScrollToEmptyField = () => {
    if (!deliveryInfo.name.trim()) {
      Alert.alert('입력 오류', '받는 사람 이름을 입력해주세요.', [
        {
          text: '확인',
          onPress: () => scrollToInput(nameInputRef, nameContainerRef),
        },
      ]);
      return false;
    }
    if (!deliveryInfo.phone.trim()) {
      Alert.alert('입력 오류', '연락처를 입력해주세요.', [
        {
          text: '확인',
          onPress: () => scrollToInput(phoneInputRef, phoneContainerRef),
        },
      ]);
      return false;
    }
    if (!deliveryInfo.zipCode.trim()) {
      Alert.alert('입력 오류', '우편번호를 입력해주세요.', [
        {
          text: '확인',
          onPress: () => scrollToInput(zipCodeInputRef, zipCodeContainerRef),
        },
      ]);
      return false;
    }
    if (!deliveryInfo.address.trim()) {
      Alert.alert('입력 오류', '주소를 입력해주세요.', [
        {
          text: '확인',
          onPress: () => scrollToInput(addressInputRef, addressContainerRef),
        },
      ]);
      return false;
    }
    if (!deliveryInfo.detailAddress.trim()) {
      Alert.alert('입력 오류', '상세 주소를 입력해주세요.', [
        {
          text: '확인',
          onPress: () =>
            scrollToInput(detailAddressInputRef, detailAddressContainerRef),
        },
      ]);
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    // 필수 정보 검증 및 스크롤
    if (!validateAndScrollToEmptyField()) {
      return;
    }

    // 결제 데이터 준비
    const totalAmount = getTotalPrice();
    const deliveryFee = totalAmount >= 30000 ? 0 : 3000;
    const finalTotal = totalAmount + deliveryFee;

    const paymentData: PaymentRequest = {
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      deliveryInfo,
      paymentMethod,
      totalAmount: finalTotal,
      deliveryFee,
    };

    // 결제 API 호출
    paymentMutation.mutate(paymentData, {
      onSuccess: response => {
        if (response.success) {
          // 결제 내역을 MMKV에 저장
          if (user?.email) {
            savePaymentHistory(user.email, response.receipt);
          }

          Alert.alert(
            '결제 완료',
            `주문번호: ${response.receipt.orderNumber}\n\n주문이 성공적으로 완료되었습니다.\n감사합니다!`,
            [
              {
                text: '확인',
                onPress: () => {
                  clearCart();
                  navigation.navigate('MainTab');
                },
              },
            ],
          );
        } else {
          Alert.alert('결제 실패', response.message);
        }
      },
      onError: error => {
        Alert.alert(
          '결제 오류',
          '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        );
        console.error('Payment error:', error);
      },
    });
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>
          {formatPrice(item.product.price)} × {item.quantity}개
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        {formatPrice(item.product.price * item.quantity)}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>결제하기</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 주문 상품 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 상품</Text>
          <FlatList
            data={items}
            renderItem={renderOrderItem}
            keyExtractor={item => item.product.id}
            scrollEnabled={false}
          />
        </View>

        {/* 배송 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MapPin size={20} color={COLORS.primary} /> 배송 정보
          </Text>

          <View ref={nameContainerRef} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>받는 사람</Text>
            <TextInput
              ref={nameInputRef}
              style={styles.textInput}
              value={deliveryInfo.name}
              onChangeText={text =>
                setDeliveryInfo({ ...deliveryInfo, name: text })
              }
              placeholder="이름을 입력하세요"
            />
          </View>

          <View ref={phoneContainerRef} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>연락처</Text>
            <TextInput
              ref={phoneInputRef}
              style={styles.textInput}
              value={deliveryInfo.phone}
              onChangeText={text =>
                setDeliveryInfo({ ...deliveryInfo, phone: text })
              }
              placeholder="010-0000-0000"
              keyboardType="phone-pad"
            />
          </View>

          <View ref={zipCodeContainerRef} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>우편번호</Text>
            <View style={styles.zipCodeContainer}>
              <TextInput
                ref={zipCodeInputRef}
                style={[styles.textInput, styles.zipCodeInput]}
                value={deliveryInfo.zipCode}
                onChangeText={text =>
                  setDeliveryInfo({ ...deliveryInfo, zipCode: text })
                }
                placeholder="12345"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>검색</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View ref={addressContainerRef} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>주소</Text>
            <TextInput
              ref={addressInputRef}
              style={styles.textInput}
              value={deliveryInfo.address}
              onChangeText={text =>
                setDeliveryInfo({ ...deliveryInfo, address: text })
              }
              placeholder="기본 주소를 입력하세요"
            />
          </View>

          <View ref={detailAddressContainerRef} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>상세 주소</Text>
            <TextInput
              ref={detailAddressInputRef}
              style={styles.textInput}
              value={deliveryInfo.detailAddress}
              onChangeText={text =>
                setDeliveryInfo({ ...deliveryInfo, detailAddress: text })
              }
              placeholder="상세 주소를 입력하세요"
            />
          </View>
        </View>

        {/* 결제 방법 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <CreditCard size={20} color={COLORS.primary} /> 결제 방법
          </Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentOptionContent}>
              <CreditCard
                size={24}
                color={
                  paymentMethod === 'card' ? COLORS.accent : COLORS.secondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === 'card' && styles.paymentOptionTextSelected,
                ]}
              >
                신용카드
              </Text>
            </View>
            {paymentMethod === 'card' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'bank' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('bank')}
          >
            <View style={styles.paymentOptionContent}>
              <CreditCard
                size={24}
                color={
                  paymentMethod === 'bank' ? COLORS.accent : COLORS.secondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === 'bank' && styles.paymentOptionTextSelected,
                ]}
              >
                무통장입금
              </Text>
            </View>
            {paymentMethod === 'bank' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'kakao' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('kakao')}
          >
            <View style={styles.paymentOptionContent}>
              <CreditCard
                size={24}
                color={
                  paymentMethod === 'kakao' ? COLORS.accent : COLORS.secondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === 'kakao' && styles.paymentOptionTextSelected,
                ]}
              >
                카카오페이
              </Text>
            </View>
            {paymentMethod === 'kakao' && (
              <View style={styles.selectedIndicator} />
            )}
          </TouchableOpacity>
        </View>

        {/* 주문 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주문 요약</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>상품 금액</Text>
            <Text style={styles.summaryValue}>
              {formatPrice(getTotalPrice())}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>배송비</Text>
            <Text style={styles.summaryValue}>
              {getTotalPrice() >= 30000 ? '무료' : '3,000원'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>총 결제 금액</Text>
            <Text style={styles.totalValue}>
              {formatPrice(
                getTotalPrice() + (getTotalPrice() >= 30000 ? 0 : 3000),
              )}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 결제 버튼 */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            paymentMutation.isPending && styles.paymentButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={paymentMutation.isPending}
        >
          <Text style={styles.paymentButtonText}>
            {paymentMutation.isPending
              ? '결제 처리 중...'
              : `${formatPrice(
                  getTotalPrice() + (getTotalPrice() >= 30000 ? 0 : 3000),
                )} 결제하기`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  zipCodeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  zipCodeInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  paymentOptionSelected: {
    borderColor: COLORS.accent,
    backgroundColor: '#FFF8F0',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  paymentOptionTextSelected: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  paymentButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: COLORS.white,
  },
  paymentButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  paymentButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentButtonDisabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.7,
  },
});

export default CheckoutScreen;
