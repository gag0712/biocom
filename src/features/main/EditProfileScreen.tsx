import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS } from '../../shared/ui/color';
import { useAuthStore } from '../../shared/store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/type';
import { UserUpdateData } from '../../shared/type';
import { useUpdateUserMutation } from '../../shared/api/user/hook';

const EditProfileScreen = () => {
  const { user, updateUser } = useAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    updateUser: updateUserMutation,
    isLoading,
    error,
  } = useUpdateUserMutation();

  const [formData, setFormData] = useState<UserUpdateData>({
    name: user?.name || '',
    mobile: user?.mobile || '',
  });

  const handleInputChange = (field: keyof UserUpdateData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return false;
    }

    if (!formData.mobile.trim()) {
      Alert.alert('오류', '휴대폰 번호를 입력해주세요.');
      return false;
    }

    // 휴대폰 번호 형식 검증 (한국 형식)
    const mobileRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!mobileRegex.test(formData.mobile.replace(/-/g, ''))) {
      Alert.alert(
        '오류',
        '올바른 휴대폰 번호 형식을 입력해주세요.\n예: 010-1234-5678',
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // API를 통해 사용자 정보 업데이트
      await updateUserMutation(formData);

      // 로컬 스토어 업데이트
      updateUser(formData);

      Alert.alert('성공', '회원 정보가 성공적으로 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '회원 정보 수정에 실패했습니다. 다시 시도해주세요.';
      Alert.alert('오류', errorMessage);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      '취소',
      '변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?',
      [
        {
          text: '계속 편집',
          style: 'cancel',
        },
        {
          text: '취소',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>회원 정보 수정</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          {/* 이메일 (읽기 전용) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>{user?.email}</Text>
            </View>
            <Text style={styles.helperText}>이메일은 변경할 수 없습니다.</Text>
          </View>

          {/* 이름 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름 *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="이름을 입력해주세요"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* 휴대폰 번호 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>휴대폰 번호 *</Text>
            <TextInput
              style={styles.input}
              value={formData.mobile}
              onChangeText={value => handleInputChange('mobile', value)}
              placeholder="010-1234-5678"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              하이픈(-) 없이 입력해도 됩니다.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? '저장 중...' : '저장'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    borderColor: '#FF6B6B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: COLORS.white,
    color: COLORS.primary,
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.lightGray,
  },
  readOnlyText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
