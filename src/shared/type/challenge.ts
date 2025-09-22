export interface ChallengeQuestion {
  id: number;
  question: string;
  category: string;
}

export interface ChallengeAnswer {
  questionId: number;
  score: number; // 1-5 점수
}

export interface ChallengeResult {
  totalScore: number;
  averageScore: number;
  healthLevel: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor';
  recommendations: string[];
  analysis: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: 1,
    question: '규칙적인 운동을 하고 있습니까?',
    category: '운동',
  },
  {
    id: 2,
    question: '충분한 수면을 취하고 있습니까?',
    category: '수면',
  },
  {
    id: 3,
    question: '균형 잡힌 식단을 유지하고 있습니까?',
    category: '영양',
  },
  {
    id: 4,
    question: '스트레스를 잘 관리하고 있습니까?',
    category: '정신건강',
  },
  {
    id: 5,
    question: '전반적으로 건강한 생활습관을 유지하고 있습니까?',
    category: '전반적 건강',
  },
];

export const SCORE_LABELS = {
  1: '전혀 아니다',
  2: '아니다',
  3: '보통이다',
  4: '그렇다',
  5: '매우 그렇다',
} as const;
