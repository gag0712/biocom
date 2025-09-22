import { UserUpdateData, User } from '../../type';

// 사용자 정보 업데이트 API
export const updateUserInfo = async (
  updateData: UserUpdateData,
): Promise<User> => {
  try {
    // Mock API 응답 시뮬레이션 (네트워크 지연 시뮬레이션)
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // Mock 성공/실패 시뮬레이션 (10% 확률로 실패)
    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      throw new Error('네트워크 오류가 발생했습니다.');
    }

    // Mock 응답 데이터 (실제로는 서버에서 받은 데이터 사용)
    const mockUpdatedUser: User = {
      email: 'user@example.com', // 실제로는 현재 사용자 이메일
      password: 'hashedPassword', // 실제로는 서버에서 관리
      name: updateData.name,
      mobile: updateData.mobile,
    };

    return mockUpdatedUser;
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error);
    throw new Error('사용자 정보 업데이트에 실패했습니다.');
  }
};

// 사용자 정보 조회 API (필요시 사용)
export const getUserInfo = async (): Promise<User> => {
  try {
    // Mock API 응답 시뮬레이션 (네트워크 지연 시뮬레이션)
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    // Mock 응답 데이터
    const mockUser: User = {
      email: 'user@example.com',
      password: 'hashedPassword',
      name: '홍길동',
      mobile: '010-1234-5678',
    };

    return mockUser;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw new Error('사용자 정보 조회에 실패했습니다.');
  }
};
