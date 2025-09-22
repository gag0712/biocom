import axios from 'axios';

// API 클라이언트 설정
export const apiClient = axios.create({
  baseURL: 'https://api.example.com', // 실제 API URL로 변경
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
