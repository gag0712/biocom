import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../shared/ui/color';
import { ChallengeResult } from '../../shared/type/challenge';
import { RootStackParamList } from '../../navigation/type';
import {
  Trophy,
  Star,
  TrendingUp,
  Heart,
  CheckCircle,
} from 'lucide-react-native';

type ChallengeResultScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
type ChallengeResultScreenRouteProp = RouteProp<
  RootStackParamList,
  'ChallengeResult'
>;

const ChallengeResultScreen = () => {
  const navigation = useNavigation<ChallengeResultScreenNavigationProp>();
  const route = useRoute<ChallengeResultScreenRouteProp>();
  const { result } = route.params;

  const getHealthLevelInfo = (level: ChallengeResult['healthLevel']) => {
    switch (level) {
      case 'excellent':
        return {
          title: '훌륭한 건강 상태',
          color: '#4CAF50',
          icon: Trophy,
          description: '매우 건강한 생활습관을 유지하고 있습니다!',
        };
      case 'good':
        return {
          title: '좋은 건강 상태',
          color: '#8BC34A',
          icon: Star,
          description: '전반적으로 건강한 상태입니다.',
        };
      case 'average':
        return {
          title: '보통 건강 상태',
          color: '#FF9800',
          icon: TrendingUp,
          description: '건강 관리에 더 신경 써야 할 것 같습니다.',
        };
      case 'poor':
        return {
          title: '개선이 필요한 상태',
          color: '#FF5722',
          icon: Heart,
          description: '건강한 생활습관 개선이 필요합니다.',
        };
      case 'very_poor':
        return {
          title: '즉시 개선이 필요한 상태',
          color: '#F44336',
          icon: CheckCircle,
          description: '건강 관리에 즉각적인 개선이 필요합니다.',
        };
    }
  };

  const healthInfo = getHealthLevelInfo(result.healthLevel);
  const IconComponent = healthInfo.icon;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleRetakeChallenge = () => {
    navigation.navigate('MainTab', { screen: 'Challenge' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* 결과 헤더 */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: healthInfo.color + '20' },
            ]}
          >
            <IconComponent size={48} color={healthInfo.color} />
          </View>
          <Text style={styles.healthTitle}>{healthInfo.title}</Text>
          <Text style={styles.healthDescription}>{healthInfo.description}</Text>
        </View>

        {/* 점수 정보 */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>총점</Text>
            <Text style={styles.scoreValue}>{result.totalScore}점</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>평균</Text>
            <Text style={styles.scoreValue}>{result.averageScore}점</Text>
          </View>
        </View>

        {/* 분석 결과 */}
        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>분석 결과</Text>
          <View style={styles.analysisCard}>
            <Text style={styles.analysisText}>{result.analysis}</Text>
          </View>
        </View>

        {/* 추천사항 */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>건강 개선 추천사항</Text>
          {result.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <View style={styles.recommendationBullet} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>

        {/* 건강 상태 바 */}
        <View style={styles.healthBarSection}>
          <Text style={styles.sectionTitle}>건강 상태</Text>
          <View style={styles.healthBarContainer}>
            <View style={styles.healthBar}>
              <View
                style={[
                  styles.healthBarFill,
                  {
                    width: `${(result.averageScore / 5) * 100}%`,
                    backgroundColor: healthInfo.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.healthBarText}>{result.averageScore}/5.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* 버튼 영역 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.retakeButton]}
          onPress={handleRetakeChallenge}
        >
          <Text style={styles.retakeButtonText}>다시 하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  healthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  healthDescription: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  scoreSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  analysisSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  analysisCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  analysisText: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 24,
  },
  recommendationsSection: {
    marginBottom: 30,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginTop: 8,
    marginRight: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 24,
  },
  healthBarSection: {
    marginBottom: 30,
  },
  healthBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    minWidth: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retakeButton: {
    backgroundColor: COLORS.accent,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  backButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
});

export default ChallengeResultScreen;
