import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Star, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '../shared/ui/color';
import { Review, ReviewSummary } from '../shared/type';

const { width: screenWidth } = Dimensions.get('window');

interface ReviewSectionProps {
  productId: string;
}

// 샘플 리뷰 데이터
const sampleReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: '김**',
    rating: 5,
    title: '정말 만족스러운 상품입니다!',
    content:
      '품질이 정말 좋고 배송도 빠르게 왔어요. 다음에도 주문할 예정입니다.',
    createdAt: '2024-01-15',
    images: ['https://picsum.photos/seed/review1/200/200'],
    helpful: 12,
    verified: true,
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: '이**',
    rating: 4,
    title: '가격 대비 괜찮은 상품',
    content:
      '전반적으로 만족하지만 포장이 조금 아쉬웠어요. 상품 자체는 좋습니다.',
    createdAt: '2024-01-12',
    helpful: 8,
    verified: true,
  },
  {
    id: '3',
    productId: '1',
    userId: 'user3',
    userName: '박**',
    rating: 5,
    title: '완벽한 상품이에요',
    content: '사진과 똑같고 품질도 기대 이상입니다. 추천해요!',
    createdAt: '2024-01-10',
    images: [
      'https://picsum.photos/seed/review2/200/200',
      'https://picsum.photos/seed/review3/200/200',
    ],
    helpful: 15,
    verified: false,
  },
  {
    id: '4',
    productId: '1',
    userId: 'user4',
    userName: '최**',
    rating: 3,
    title: '보통이에요',
    content: '특별히 좋지도 나쁘지도 않은 평범한 상품입니다.',
    createdAt: '2024-01-08',
    helpful: 3,
    verified: true,
  },
  {
    id: '5',
    productId: '1',
    userId: 'user5',
    userName: '정**',
    rating: 5,
    title: '최고의 상품!',
    content: '정말 좋은 상품이에요. 가족 모두 만족하고 있습니다.',
    createdAt: '2024-01-05',
    helpful: 20,
    verified: true,
  },
];

// 샘플 리뷰 요약 데이터
const sampleReviewSummary: ReviewSummary = {
  averageRating: 4.4,
  totalReviews: 127,
  ratingDistribution: {
    5: 89,
    4: 25,
    3: 8,
    2: 3,
    1: 2,
  },
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const reviewsToShow = showAllReviews
    ? sampleReviews
    : sampleReviews.slice(0, 3);

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={size}
            color={star <= rating ? '#FFD700' : '#E0E0E0'}
            fill={star <= rating ? '#FFD700' : 'transparent'}
          />
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <View style={styles.ratingBarContainer}>
        <Text style={styles.ratingLabel}>{rating}점</Text>
        <View style={styles.ratingBarBackground}>
          <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.ratingCount}>{count}</Text>
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: Review }) => {
    const isExpanded = expandedReview === item.id;
    const shouldTruncate = item.content.length > 100 && !isExpanded;

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewUserInfo}>
            <Text style={styles.userName}>{item.userName}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>구매확인</Text>
              </View>
            )}
          </View>
          <View style={styles.reviewMeta}>
            {renderStars(item.rating, 14)}
            <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.reviewTitle}>{item.title}</Text>

        <Text style={styles.reviewContent}>
          {shouldTruncate
            ? `${item.content.substring(0, 100)}...`
            : item.content}
        </Text>

        {shouldTruncate && (
          <TouchableOpacity
            onPress={() => setExpandedReview(item.id)}
            style={styles.expandButton}
          >
            <Text style={styles.expandText}>더보기</Text>
            <ChevronDown size={14} color={COLORS.accent} />
          </TouchableOpacity>
        )}

        {isExpanded && item.content.length > 100 && (
          <TouchableOpacity
            onPress={() => setExpandedReview(null)}
            style={styles.expandButton}
          >
            <Text style={styles.expandText}>접기</Text>
            <ChevronUp size={14} color={COLORS.accent} />
          </TouchableOpacity>
        )}

        {item.images && item.images.length > 0 && (
          <View style={styles.reviewImages}>
            {item.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.reviewImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        <View style={styles.reviewFooter}>
          <TouchableOpacity style={styles.helpfulButton}>
            <ThumbsUp size={14} color={COLORS.secondary} />
            <Text style={styles.helpfulText}>도움됨 {item.helpful}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>상품 리뷰</Text>

      {/* 리뷰 요약 */}
      <View style={styles.summaryContainer}>
        <View style={styles.ratingOverview}>
          <View style={styles.averageRating}>
            <Text style={styles.averageRatingNumber}>
              {sampleReviewSummary.averageRating}
            </Text>
            <View style={styles.averageRatingStars}>
              {renderStars(Math.round(sampleReviewSummary.averageRating), 20)}
            </View>
            <Text style={styles.totalReviews}>
              ({sampleReviewSummary.totalReviews}개 리뷰)
            </Text>
          </View>
        </View>

        <View style={styles.ratingDistribution}>
          {[5, 4, 3, 2, 1].map(rating =>
            renderRatingBar(
              rating,
              sampleReviewSummary.ratingDistribution[
                rating as keyof typeof sampleReviewSummary.ratingDistribution
              ],
              sampleReviewSummary.totalReviews,
            ),
          )}
        </View>
      </View>

      {/* 리뷰 목록 */}
      <FlatList
        data={reviewsToShow}
        renderItem={renderReviewItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* 더보기 버튼 */}
      {sampleReviews.length > 3 && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAllReviews(!showAllReviews)}
        >
          <Text style={styles.showMoreText}>
            {showAllReviews
              ? '리뷰 접기'
              : `리뷰 더보기 (${sampleReviews.length - 3}개 더)`}
          </Text>
          {showAllReviews ? (
            <ChevronUp size={16} color={COLORS.accent} />
          ) : (
            <ChevronDown size={16} color={COLORS.accent} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  averageRating: {
    alignItems: 'center',
  },
  averageRatingNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  averageRatingStars: {
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  ratingDistribution: {
    gap: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    width: 24,
  },
  ratingBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.secondary,
    width: 24,
    textAlign: 'right',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  verifiedBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600',
  },
  reviewMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  expandText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  helpfulText: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
});

export default ReviewSection;

