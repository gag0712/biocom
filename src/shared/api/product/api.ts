import axios from 'axios';
import { Product } from '../../type';

// 샘플 상품 데이터
const sampleProducts: Product[] = [
  {
    id: '1',
    name: '유기농 바나나',
    price: 3500,
    description: '신선한 유기농 바나나',
    image: 'https://picsum.photos/seed/banana/150/150',
    category: '과일',
    stock: 50,
  },
  {
    id: '2',
    name: '토마토',
    price: 2800,
    description: '달콤한 방울토마토',
    image: 'https://picsum.photos/seed/tomato/150/150',
    category: '채소',
    stock: 30,
  },
  {
    id: '3',
    name: '유기농 사과',
    price: 4500,
    description: '아삭한 유기농 사과',
    image: 'https://picsum.photos/seed/apple/150/150',
    category: '과일',
    stock: 25,
  },
  {
    id: '4',
    name: '시금치',
    price: 2000,
    description: '신선한 시금치',
    image: 'https://picsum.photos/seed/spinach/150/150',
    category: '채소',
    stock: 40,
  },
  {
    id: '5',
    name: '오이',
    price: 1800,
    description: '아삭한 오이',
    image: 'https://picsum.photos/seed/cucumber/150/150',
    category: '채소',
    stock: 35,
  },
  {
    id: '6',
    name: '딸기',
    price: 6000,
    description: '달콤한 딸기',
    image: 'https://picsum.photos/seed/strawberry/150/150',
    category: '과일',
    stock: 20,
  },
];

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: 'https://api.example.com', // 실제 API URL로 변경
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 상품 목록 조회 API (실제로는 서버에서 가져오지만, 현재는 샘플 데이터 반환)
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // 실제 API 호출 시뮬레이션
    await new Promise<void>(resolve => setTimeout(resolve, 1000));

    // 실제 API 호출 코드 (주석 처리)
    // const response = await apiClient.get<Product[]>('/products');
    // return response.data;

    // 현재는 샘플 데이터 반환
    return sampleProducts;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록을 불러오는데 실패했습니다.');
  }
};

// 상품 상세 조회 API
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    await new Promise<void>(resolve => setTimeout(resolve, 500));

    const product = sampleProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    return product;
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw new Error('상품 정보를 불러오는데 실패했습니다.');
  }
};

// 카테고리별 상품 조회 API
export const fetchProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    await new Promise<void>(resolve => setTimeout(resolve, 800));

    const filteredProducts = sampleProducts.filter(
      p => p.category === category,
    );
    return filteredProducts;
  } catch (error) {
    console.error('카테고리별 상품 조회 실패:', error);
    throw new Error('카테고리별 상품을 불러오는데 실패했습니다.');
  }
};
