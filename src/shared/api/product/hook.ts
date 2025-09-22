import { useQuery } from '@tanstack/react-query';
import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
} from './api';

// 상품 목록 조회 훅
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 상품 조회 훅
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000,
  });
};

// 카테고리별 상품 조회 훅
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category, // category가 있을 때만 쿼리 실행
    staleTime: 5 * 60 * 1000,
  });
};
