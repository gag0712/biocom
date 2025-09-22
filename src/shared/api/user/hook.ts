import { useState } from 'react';
import { updateUserInfo } from './api';
import { UserUpdateData, User } from '../../type';

interface UseUpdateUserMutationResult {
  updateUser: (data: UserUpdateData) => Promise<User>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const useUpdateUserMutation = (): UseUpdateUserMutationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateUser = async (data: UserUpdateData): Promise<User> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const updatedUser = await updateUserInfo(data);
      setIsSuccess(true);
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  };

  return {
    updateUser,
    isLoading,
    error,
    isSuccess,
    reset,
  };
};
