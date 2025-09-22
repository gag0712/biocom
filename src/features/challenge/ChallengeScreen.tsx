import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../shared/ui/color';
import {
  CHALLENGE_QUESTIONS,
  SCORE_LABELS,
  ChallengeAnswer,
  ChallengeResult,
} from '../../shared/type/challenge';
import { RootStackParamList } from '../../navigation/type';

type ChallengeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const ChallengeScreen = () => {
  const navigation = useNavigation<ChallengeScreenNavigationProp>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ChallengeAnswer[]>([]);

  const currentQuestion = CHALLENGE_QUESTIONS[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === CHALLENGE_QUESTIONS.length - 1;

  const handleAnswerSelect = (score: number) => {
    const newAnswer: ChallengeAnswer = {
      questionId: currentQuestion.id,
      score: score,
    };

    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      answer => answer.questionId === currentQuestion.id,
    );

    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    const currentAnswer = answers.find(
      answer => answer.questionId === currentQuestion.id,
    );

    if (!currentAnswer) {
      Alert.alert('알림', '답변을 선택해주세요.');
      return;
    }

    if (isLastQuestion) {
      // 설문 완료 - 결과 계산 및 결과 화면으로 이동
      const result = calculateResult(answers);
      navigation.navigate('ChallengeResult', { result });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResult = (userAnswers: ChallengeAnswer[]): ChallengeResult => {
    const totalScore = userAnswers.reduce(
      (sum, answer) => sum + answer.score,
      0,
    );
    const averageScore = totalScore / userAnswers.length;

    let healthLevel: ChallengeResult['healthLevel'];
    let recommendations: string[];
    let analysis: string;

    if (averageScore >= 4.5) {
      healthLevel = 'excellent';
      recommendations = [
        '현재 건강한 생활습관을 잘 유지하고 있습니다.',
        '규칙적인 건강 검진을 받아보세요.',
        '다른 사람들에게 건강한 생활습관을 공유해보세요.',
      ];
      analysis = '훌륭한 건강 상태를 유지하고 있습니다!';
    } else if (averageScore >= 3.5) {
      healthLevel = 'good';
      recommendations = [
        '전반적으로 좋은 건강 상태입니다.',
        '몇 가지 영역에서 개선할 여지가 있습니다.',
        '규칙적인 운동을 더 늘려보세요.',
      ];
      analysis = '좋은 건강 상태를 유지하고 있습니다.';
    } else if (averageScore >= 2.5) {
      healthLevel = 'average';
      recommendations = [
        '건강한 생활습관 개선이 필요합니다.',
        '규칙적인 운동과 균형 잡힌 식단을 유지하세요.',
        '충분한 수면을 취하도록 노력하세요.',
      ];
      analysis = '건강 관리에 더 신경 써야 할 것 같습니다.';
    } else if (averageScore >= 1.5) {
      healthLevel = 'poor';
      recommendations = [
        '건강한 생활습관을 개선해야 합니다.',
        '전문가와 상담을 받아보세요.',
        '작은 변화부터 시작해보세요.',
      ];
      analysis = '건강 관리에 적극적인 개선이 필요합니다.';
    } else {
      healthLevel = 'very_poor';
      recommendations = [
        '즉시 건강한 생활습관을 개선해야 합니다.',
        '의료 전문가와 상담을 받으세요.',
        '단계적으로 건강한 습관을 만들어가세요.',
      ];
      analysis = '건강 관리에 즉각적인 개선이 필요합니다.';
    }

    return {
      totalScore,
      averageScore: Math.round(averageScore * 10) / 10,
      healthLevel,
      recommendations,
      analysis,
    };
  };

  const getCurrentAnswer = () => {
    return answers.find(answer => answer.questionId === currentQuestion.id);
  };

  const renderScoreButton = (score: number) => {
    const isSelected = getCurrentAnswer()?.score === score;

    return (
      <TouchableOpacity
        key={score}
        style={[styles.scoreButton, isSelected && styles.selectedScoreButton]}
        onPress={() => handleAnswerSelect(score)}
      >
        <Text
          style={[
            styles.scoreButtonText,
            isSelected && styles.selectedScoreButtonText,
          ]}
        >
          {score}
        </Text>
        <Text
          style={[styles.scoreLabel, isSelected && styles.selectedScoreLabel]}
        >
          {SCORE_LABELS[score as keyof typeof SCORE_LABELS]}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>건강 체크 챌린지</Text>
        <Text style={styles.progress}>
          {currentQuestionIndex + 1} / {CHALLENGE_QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Text style={styles.category}>{currentQuestion.category}</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.scoreContainer}>
          {[1, 2, 3, 4, 5].map(renderScoreButton)}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.previousButton]}
            onPress={handlePrevious}
          >
            <Text style={styles.previousButtonText}>이전</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            !getCurrentAnswer() && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!getCurrentAnswer()}
        >
          <Text
            style={[
              styles.nextButtonText,
              !getCurrentAnswer() && styles.disabledButtonText,
            ]}
          >
            {isLastQuestion ? '완료' : '다음'}
          </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  progress: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  category: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: 12,
  },
  question: {
    fontSize: 20,
    color: COLORS.primary,
    lineHeight: 28,
    fontWeight: '500',
  },
  scoreContainer: {
    gap: 12,
  },
  scoreButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedScoreButton: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent + '10',
  },
  scoreButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  selectedScoreButtonText: {
    color: COLORS.accent,
  },
  scoreLabel: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  selectedScoreLabel: {
    color: COLORS.accent,
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
  previousButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  nextButton: {
    backgroundColor: COLORS.accent,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButtonText: {
    color: COLORS.secondary,
  },
});

export default ChallengeScreen;
