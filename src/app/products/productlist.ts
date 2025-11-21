import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from './product.service';
import { Product } from './product.interface';
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';
import { ProductCard } from './product-card/product-card';
import { ProductFilters } from './product-filters/product-filters';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule, Header, Footer, ProductCard, ProductFilters],
  templateUrl: './productlist.html',
})
export class Productlist implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  products: WritableSignal<Product[]> = signal<Product[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  error: WritableSignal<string | null> = signal<string | null>(null);

  // Derived state for categories
  categories = computed(() => {
    const products = this.products();
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  });

  selectedCategories: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  sortOption: WritableSignal<string> = signal<string>('featured');

  // Pagination
  currentPage: WritableSignal<number> = signal<number>(1);
  pageSize: WritableSignal<number> = signal<number>(12);

  filteredProducts = computed(() => {
    const products = this.products();
    const selected = this.selectedCategories();
    const sort = this.sortOption();

    let result = products;

    // Filter by Category
    if (selected.size > 0) {
      result = result.filter((p) => selected.has(p.category));
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

  paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return products.slice(startIndex, startIndex + size);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize());
  });

  ngOnInit() {
    this.loadProducts();
    this.setupSearchSubscription();
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  setupSearchSubscription() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.isLoading.set(true);
          this.currentPage.set(1); // Reset to first page on search
          return query
            ? this.productService.searchProducts(query)
            : this.productService.getProducts();
        })
      )
      .subscribe({
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
    this.currentPage.set(1); // Reset to first page on filter change
  }

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOption.set(value);
    this.currentPage.set(1); // Reset to first page on sort change
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
