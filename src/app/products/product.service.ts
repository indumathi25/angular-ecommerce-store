import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from './product.interface';
import { environment } from '../../environments/environment';

/**
 * Service to manage product-related data operations.
 * Handles fetching products, searching, and retrieving product details.
 * Interacts with the backend proxy via the configured API URL.
 * Also acts as a state store for the product list view to persist state across navigation.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  // State Management Signals
  readonly productsState: WritableSignal<Product[]> = signal<Product[]>([]);
  readonly searchQueryState: WritableSignal<string> = signal<string>('');
  readonly selectedCategoriesState: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  readonly sortOptionState: WritableSignal<string> = signal<string>('featured');
  readonly currentPageState: WritableSignal<number> = signal<number>(1);
  readonly isStateInitialized: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Fetches a paginated list of products.
   * @param skip The number of items to skip (for pagination). Defaults to 0.
   * @param limit The maximum number of items to return. Defaults to 30.
   * @returns An Observable containing the product response (list and metadata).
   */
  getProducts(skip: number = 0, limit: number = 30): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }

  /**
   * Searches for products matching a query string.
   * @param query The search term.
   * @param skip The number of items to skip. Defaults to 0.
   * @param limit The maximum number of items to return. Defaults to 30.
   * @returns An Observable containing the search results.
   */
  searchProducts(query: string, skip: number = 0, limit: number = 30): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.apiUrl}/search?q=${query}&skip=${skip}&limit=${limit}`
    );
  }

  /**
   * Retrieves details for a specific product by its ID.
   * @param id The unique identifier of the product.
   * @returns An Observable of the Product object.
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
