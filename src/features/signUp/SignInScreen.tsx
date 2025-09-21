import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../shared/ui/color';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const SignInScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { top, bottom } = useSafeAreaInsets();

  const handleSignIn = () => {
    console.log('로그인 시도:', { id, password });
  };

  return (
    <View
      style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>로그인</Text>
            <Text style={styles.subtitle}>계정에 로그인하세요</Text>
          </View>

          {/* 입력 필드들 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>아이디</Text>
              <TextInput
                style={styles.textInput}
                value={id}
                onChangeText={setId}
                placeholder="아이디를 입력하세요"
                placeholderTextColor={COLORS.secondary}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>비밀번호</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={COLORS.secondary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* 회원가입 링크 */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>계정이 없으신가요? </Text>
            <TouchableOpacity
              onPress={() => console.log('회원가입 화면으로 이동')}
            >
              <Text style={styles.signUpLink}>회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* 로그인 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.signInButton,
                (!id || !password) && styles.signInButtonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={!id || !password}
            >
              <Text style={styles.signInButtonText}>로그인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  signUpLink: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  signInButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    backgroundColor: COLORS.secondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignInScreen;
