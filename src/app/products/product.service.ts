import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from './product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/products';

  getProducts(skip: number = 0, limit: number = 30): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?skip=${skip}&limit=${limit}`);
  }

  searchProducts(query: string, skip: number = 0, limit: number = 30): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.apiUrl}/search?q=${query}&skip=${skip}&limit=${limit}`
    );
  }
}
