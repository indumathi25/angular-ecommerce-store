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
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';
import { ProductCard } from './product-card/product-card';
import { ProductFilters } from './product-filters/product-filters';
import { environment } from '../../environments/environment';

/**
 * Product List Component
 * Displays a paginated, filterable, and searchable list of products.
 * Manages state for products, loading, errors, pagination, and filtering.
 */
@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule, Header, Footer, ProductCard, ProductFilters],
  templateUrl: './productlist.html',
})
export class Productlist implements OnInit, OnDestroy {
  productService = inject(ProductService);
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Use state from ProductService
  products = this.productService.productsState;
  selectedCategories = this.productService.selectedCategoriesState;
  sortOption = this.productService.sortOptionState;
  currentPage = this.productService.currentPageState;
  searchQuery = this.productService.searchQueryState;

  // Local UI state
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  error: WritableSignal<string | null> = signal<string | null>(null);

  /**
   * Computed signal for available categories derived from the product list.
   * Returns a sorted array of unique category names.
   */
  categories = computed(() => {
    const products = this.products();
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  });

  // Pagination
  pageSize: WritableSignal<number> = signal<number>(environment.pageSize);

  /**
   * Computed signal for products after applying filters and sorting.
   * Does not handle pagination.
   */
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
    }

    return result;
  });

  /**
   * Computed signal for the subset of products to display on the current page.
   */
  paginatedProducts = computed(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return products.slice(startIndex, startIndex + size);
  });

  /**
   * Computed signal for the total number of pages based on filtered products.
   */
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.pageSize());
  });

  /**
   * Initializes the component.
   * Loads initial products and sets up the search subscription.
   */
  ngOnInit() {
    if (this.productService.isStateInitialized()) {
      this.isLoading.set(false);
    } else {
      this.loadProducts();
    }
    this.setupSearchSubscription();
  }

  /**
   * Cleans up subscriptions when the component is destroyed.
   */
  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  /**
   * Sets up the search subject subscription with debounce and distinctUntilChanged.
   * Switches the observable to the search API call.
   */
  setupSearchSubscription() {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((query) => {
          this.isLoading.set(true);
          this.currentPage.set(1); // Reset to first page on search
          this.productService.searchQueryState.set(query); // Persist search query
          return query
            ? this.productService.searchProducts(query)
            : this.productService.getProducts();
        })
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.productService.isStateInitialized.set(true);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load products. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Loads the initial list of products from the service.
   */
  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.productService.isStateInitialized.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Handles category filter toggles.
   * Updates the selectedCategories signal and resets pagination.
   * @param event Object containing the category name and its checked state.
   */
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

  /**
   * Handles sort option changes.
   * Updates the sortOption signal and resets pagination.
   * @param event The change event from the select element.
   */
  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sortOption.set(value);
    this.currentPage.set(1); // Reset to first page on sort change
  }

  /**
   * Pushes a new search query to the search subject.
   * @param query The search text.
   */
  onSearch(query: string) {
    this.searchSubject.next(query);
  }

  /**
   * Changes the current page.
   * Validates the page number and scrolls to the top.
   * @param page The new page number.
   */
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
