import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  Category,
  CreateOrderRequest,
  LoginRequest,
  LoginResponse,
  Order,
  OrderFilters,
  PaginatedResponse,
  Product,
  ProductFilters,
} from '../types/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<ApiResponse<LoginResponse>>('/login', credentials);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data;
  }

  // Products
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays properly for Laravel (e.g., category_id[0], category_id[1])
            value.forEach((v, index) => {
              params.append(`${key}[${index}]`, v.toString());
            });
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await this.api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await this.api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  }

  // Orders
  async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.api.get<PaginatedResponse<Order>>(`/orders?${params.toString()}`);
    return response.data;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await this.api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
export default apiService; 