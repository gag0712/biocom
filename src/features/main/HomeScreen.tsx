import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../shared/ui/color';
import { useAuthStore } from '../../shared/store/authStore';

const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text style={styles.welcome}>안녕하세요, {user?.name}님!</Text>
      <Text style={styles.subtitle}>Biocom에 오신 것을 환영합니다.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    color: COLORS.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
