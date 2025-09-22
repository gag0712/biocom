# Biocom - React Native 전자상거래 앱

Biocom은 React Native로 개발된 모바일 전자상거래 애플리케이션입니다. 사용자 인증, 상품 관리, 장바구니, 결제, 주문 관리 등의 핵심 전자상거래 기능을 제공합니다.

## 🚀 주요 기능

### 🔐 사용자 인증

- 회원가입 및 로그인
- 사용자 프로필 관리
- 프로필 정보 수정

### 🛍️ 상품 관리

- 상품 목록 조회
- 상품 상세 정보 보기
- 카테고리별 상품 분류
- 재고 관리

### 🛒 장바구니

- 상품 추가/제거
- 수량 조절
- 총 가격 계산
- 장바구니 상태 관리

### 💳 결제 시스템

- 다양한 결제 수단 지원 (카드, 계좌이체, 카카오페이)
- 배송 정보 입력
- 결제 내역 저장
- 결제 영수증 생성

### 📦 주문 관리

- 주문 내역 조회
- 주문 상세 정보
- 배송 상태 추적

## 🛠️ 기술 스택

### Frontend

- **React Native 0.81.4** - 크로스 플랫폼 모바일 앱 개발
- **TypeScript** - 타입 안전성 보장
- **React Navigation** - 네비게이션 관리
- **Zustand** - 상태 관리
- **TanStack Query** - 서버 상태 관리 및 캐싱
- **Axios** - HTTP 클라이언트

### UI/UX

- **Lucide React Native** - 아이콘 라이브러리
- **React Native Reanimated** - 애니메이션
- **React Native Gesture Handler** - 제스처 처리
- **React Native Safe Area Context** - 안전 영역 관리
- **React Native Keyboard Controller** - 키보드 관리

### Storage

- **React Native MMKV** - 고성능 로컬 스토리지

### Development Tools

- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Jest** - 테스팅 프레임워크
- **Metro** - 번들러

## 📱 앱 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── features/           # 기능별 화면 컴포넌트
│   ├── cart/          # 장바구니 관련
│   ├── checkout/      # 결제 관련
│   ├── main/          # 메인 기능 (프로필 등)
│   ├── order/         # 주문 관리
│   ├── product/       # 상품 관리
│   └── signUp/        # 회원가입/로그인
├── navigation/         # 네비게이션 설정
├── shared/            # 공통 모듈
│   ├── api/           # API 관련
│   ├── services/      # 서비스 레이어
│   ├── store/         # 상태 관리
│   ├── type/          # 타입 정의
│   └── ui/            # UI 관련 (색상, 스타일)
```

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 20
- Yarn 4.9.4
- React Native CLI
- Android Studio (Android 개발용)
- Xcode (iOS 개발용)

### 설치 및 실행

1. **저장소 클론**

```bash
git clone <repository-url>
cd Biocom
```

2. **의존성 설치**

```bash
yarn install
```

3. **iOS 의존성 설치 (iOS 개발시)**

```bash
cd ios && pod install && cd ..
```

4. **앱 실행**

Android:

```bash
yarn android
```

iOS:

```bash
yarn ios
```

5. **개발 서버 시작**

```bash
yarn start
```

## 📋 사용 가능한 스크립트

- `yarn start` - Metro 번들러 시작
- `yarn android` - Android 앱 실행
- `yarn ios` - iOS 앱 실행
- `yarn test` - 테스트 실행
- `yarn lint` - ESLint 검사
- `yarn rewatch` - Watchman 재시작

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: #1B1B1B (주요 텍스트)
- **Accent**: #18b4ad (강조 색상)
- **Secondary**: #545454 (보조 텍스트)
- **Background**: #f8f9fa (배경색)
- **Success**: #28a745 (성공 상태)
- **Warning**: #ffc107 (경고 상태)
- **Error**: #dc3545 (오류 상태)

## 🔧 API 설정

API 클라이언트는 `src/shared/api/axios.ts`에서 설정됩니다. 실제 서버 URL로 변경해주세요:

```typescript
export const apiClient = axios.create({
  baseURL: 'https://your-api-url.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 📦 주요 의존성

### 핵심 라이브러리

- `@react-navigation/native` - 네비게이션
- `@tanstack/react-query` - 서버 상태 관리
- `zustand` - 클라이언트 상태 관리
- `axios` - HTTP 클라이언트
- `react-native-mmkv` - 로컬 스토리지

### UI 라이브러리

- `lucide-react-native` - 아이콘
- `react-native-reanimated` - 애니메이션
- `react-native-gesture-handler` - 제스처

## 🧪 테스팅

```bash
# 테스트 실행
yarn test

# 테스트 커버리지 확인
yarn test --coverage
```

## 📱 지원 플랫폼

- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 11.0+

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Biocom** - 현대적이고 사용자 친화적인 전자상거래 경험을 제공합니다.
