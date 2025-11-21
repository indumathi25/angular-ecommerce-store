import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';
import { setCookie } from '../core/cookie.utils';
import { ProductService } from './product.service';
import { Product } from './product.interface';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productlist.html',
})
export class Productlist implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  categories = computed(() => {
    const products = this.products();
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  });

  selectedCategories = signal<Set<string>>(new Set());

  filteredProducts = computed(() => {
    const products = this.products();
    const selected = this.selectedCategories();

    if (selected.size === 0) {
      return products;
    }

    return products.filter((p) => selected.has(p.category));
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
