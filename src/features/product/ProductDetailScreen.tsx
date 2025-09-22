import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/type';
import { COLORS } from '../../shared/ui/color';
import { ShoppingBag, CreditCard } from 'lucide-react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useProduct } from '../../shared/api/product/hook';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;

  const { data: product, isLoading, isError } = useProduct(productId);

  const { top, bottom } = useSafeAreaInsets();

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
        <TouchableOpacity style={styles.paymentButton}>
          <CreditCard size={20} color={COLORS.white} />
          <Text style={styles.paymentButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>

      {/* 플로팅 장바구니 버튼 */}
      <TouchableOpacity style={styles.cartFloatingButton}>
        <ShoppingBag size={24} color={COLORS.white} />
      </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ProductDetailScreen;
