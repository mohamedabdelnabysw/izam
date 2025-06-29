export interface Category {
  id: number;
  name: string;
  description?: string;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category_id: number;
  image_url?: string;
  is_active: boolean;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  order_details: OrderDetail[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  product: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ProductFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  category_id?: number[];
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface OrderFilters {
  status?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
}

export interface CreateOrderRequest {
  products: {
    product_id: number;
    quantity: number;
  }[];
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
} 