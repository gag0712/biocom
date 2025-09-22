export type User = {
  email: string;
  password: string;
  name: string;
  mobile: string;
};

export type UserUpdateData = {
  name: string;
  mobile: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
  helpful: number;
  verified: boolean;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};
