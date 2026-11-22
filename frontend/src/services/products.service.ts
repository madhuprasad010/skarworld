import { apiClient, IS_DEV } from './api-client';
import { mockProductsHandlers } from '@/mock/handlers';
import type {
  Product,
  ProductFilters,
  CreateProductDto,
  UpdateProductDto,
  PaginatedResponse,
} from '@/types';

export class ProductsService {
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    try {
      if (IS_DEV) {
        return await mockProductsHandlers.getProducts(filters);
      }
      return await apiClient.get<PaginatedResponse<Product>>(
        '/products',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[ProductsService.getProducts] Error:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product> {
    try {
      if (IS_DEV) {
        return await mockProductsHandlers.getProduct(id);
      }
      return await apiClient.get<Product>(`/products/${id}`);
    } catch (error) {
      console.error(`[ProductsService.getProduct] Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      if (IS_DEV) {
        return await mockProductsHandlers.createProduct(data);
      }
      return await apiClient.post<Product>('/products', data);
    } catch (error) {
      console.error('[ProductsService.createProduct] Error:', error);
      throw error;
    }
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      if (IS_DEV) {
        return await mockProductsHandlers.updateProduct(id, data);
      }
      return await apiClient.patch<Product>(`/products/${id}`, data);
    } catch (error) {
      console.error(`[ProductsService.updateProduct] Error updating ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      if (IS_DEV) {
        return await mockProductsHandlers.deleteProduct(id);
      }
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`[ProductsService.deleteProduct] Error deleting ${id}:`, error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();
