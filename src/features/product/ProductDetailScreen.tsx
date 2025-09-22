import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';
import { COLORS } from '../../shared/ui/color';
import { ShoppingBag, CreditCard, Minus, Plus } from 'lucide-react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useProduct } from '../../shared/api/product/hook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../shared/store/cartStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { productId } = route.params;

  const { data: product, isLoading, isError } = useProduct(productId);
  const { addToCart } = useCartStore();
  const { top, bottom } = useSafeAreaInsets();

  const [quantity, setQuantity] = useState(1);

  const scale = useSharedValue(1);
  const buttonWidth = useSharedValue(56);
  const buttonTextOpacity = useSharedValue(0);

  // 샘플 이미지 배열 (실제로는 product.images 배열을 사용)
  const images = product
    ? [
        product.image,
        'https://picsum.photos/seed/detail1/400/400',
        'https://picsum.photos/seed/detail2/400/400',
        'https://picsum.photos/seed/detail3/400/400',
      ]
    : [];

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // 선택한 수량만큼 장바구니에 추가
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    // 버튼 애니메이션 시작
    scale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 100 }),
      withSpring(1, { damping: 8, stiffness: 100 }),
    );

    // 버튼 너비 애니메이션 (왼쪽으로 늘어나기)
    buttonWidth.value = withSequence(
      withTiming(140, { duration: 300 }), // 56 -> 140으로 늘어남 (텍스트 공간 확보)
      withTiming(140, { duration: 1000 }), // 1초간 유지
      withTiming(56, { duration: 300 }), // 다시 원래 크기로
    );

    // 텍스트 페이드 인/아웃
    buttonTextOpacity.value = withSequence(
      withTiming(0, { duration: 300 }), // 처음에는 투명
      withTiming(1, { duration: 300 }), // 페이드 인
      withTiming(1, { duration: 1000 }), // 1초간 유지
      withTiming(0, { duration: 300 }), // 페이드 아웃
    );

    // 2초 후 모달 표시 (애니메이션 완료 후)
    setTimeout(() => {
      Alert.alert(
        '장바구니에 추가되었습니다',
        `${quantity}개의 상품이 장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?`,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('Cart');
            },
          },
        ],
      );
    }, 2000);
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      width: buttonWidth.value,
      paddingHorizontal: buttonWidth.value > 56 ? 16 : 0,
    };
  });

  const animatedButtonInnerStyle = useAnimatedStyle(() => {
    return {
      flexDirection: 'row',
      gap: buttonWidth.value > 56 ? 8 : 0,
    };
  });

  const animatedButtonTextStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonTextOpacity.value,
    };
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>상품 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>상품 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const renderCarouselItem = ({ item }: { item: string }) => (
    <View style={styles.carouselItem}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 슬라이더 */}
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={screenWidth}
            height={300}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={renderCarouselItem}
            style={styles.carousel}
          />
        </View>

        {/* 상품 정보 */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>상품 설명</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>카테고리</Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>재고 현황</Text>
            <Text style={styles.stock}>
              {product.stock > 0 ? `${product.stock}개 남음` : '품절'}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>수량 선택</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus
                  size={16}
                  color={quantity <= 1 ? COLORS.secondary : COLORS.primary}
                />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity >= product.stock && styles.quantityButtonDisabled,
                ]}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus
                  size={16}
                  color={
                    quantity >= product.stock
                      ? COLORS.secondary
                      : COLORS.primary
                  }
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.quantitySubtext}>
              총 가격: {formatPrice(product.price * quantity)}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>배송 정보</Text>
            <Text style={styles.delivery}>• 무료배송 (3만원 이상 구매시)</Text>
            <Text style={styles.delivery}>
              • 평일 오후 2시 이전 주문시 당일 발송
            </Text>
            <Text style={styles.delivery}>• 배송 예상일: 1-2일</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>상품 특징</Text>
            <Text style={styles.feature}>• 신선한 유기농 제품</Text>
            <Text style={styles.feature}>• 친환경 포장재 사용</Text>
            <Text style={styles.feature}>• 엄선된 고품질 상품</Text>
          </View>
        </View>
      </ScrollView>

      {/* 결제하기 버튼 */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => {
            // 선택한 수량만큼 임시로 장바구니에 추가
            for (let i = 0; i < quantity; i++) {
              addToCart(product);
            }
            navigation.navigate('Checkout', {});
          }}
        >
          <CreditCard size={20} color={COLORS.white} />
          <Text style={styles.paymentButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>

      {/* 플로팅 장바구니 버튼 */}
      <Animated.View style={[styles.cartFloatingButton, animatedButtonStyle]}>
        <Animated.View
          style={[styles.cartButtonInner, animatedButtonInnerStyle]}
        >
          <TouchableOpacity
            style={styles.cartButtonTouchable}
            onPress={handleAddToCart}
          >
            <ShoppingBag size={24} color={COLORS.white} />
            <Animated.Text style={[styles.buttonText, animatedButtonTextStyle]}>
              추가 완료
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loadingText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  carousel: {
    width: screenWidth,
  },
  carouselItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: screenWidth,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: screenWidth - 40,
    height: 280,
    borderRadius: 12,
  },
  productInfo: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.secondary,
    lineHeight: 24,
  },
  category: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  stock: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
  },
  delivery: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  feature: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F9F9F9',
    borderColor: '#F0F0F0',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  quantitySubtext: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  paymentButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
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
  cartFloatingButton: {
    position: 'absolute',
    bottom: 90, // 결제하기 버튼 위에 위치
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: 28,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 56, // 최소 너비 보장
  },
  cartButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    flexDirection: 'row',
  },
  cartButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
