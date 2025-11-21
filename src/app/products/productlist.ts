import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './product.service';
import { Product } from './product.interface';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductFiltersComponent,
  ],
  templateUrl: './productlist.html',
})
export class Productlist implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Derived state for categories
  categories = computed(() => {
    const products = this.products();
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  });

  selectedCategories = signal<Set<string>>(new Set());
  sortOption = signal<string>('featured');

  filteredProducts = computed(() => {
    const products = this.products();
    const selected = this.selectedCategories();
    const sort = this.sortOption();

    let result = products;

    if (selected.size > 0) {
      result = products.filter((p) => selected.has(p.category));
    }

    // Create a shallow copy to avoid mutating the original array during sort
    result = [...result];

    switch (sort) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      // 'featured' or default: no sorting (or default API order)
    }

    return result;
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
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  toggleCategory(event: { category: string; isChecked: boolean }) {
    const { category, isChecked } = event;
    const currentSelected = new Set(this.selectedCategories());

    if (isChecked) {
      currentSelected.add(category);
    } else {
      currentSelected.delete(category);
    }

    this.selectedCategories.set(currentSelected);
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOption.set(value);
  }
}
