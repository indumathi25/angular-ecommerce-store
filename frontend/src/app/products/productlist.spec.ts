import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Productlist } from './productlist';
import { ProductService } from './product.service';
import { signal } from '@angular/core';
import { Product } from './product.interface';

describe('Productlist', () => {
  let component: Productlist;
  let fixture: ComponentFixture<Productlist>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockProductService: any;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product A',
      price: 10,
      category: 'Cat1',
      rating: 4.5,
      thumbnail: '',
      images: [],
      description: '',
      discountPercentage: 0,
      stock: 10,
      brand: '',
    },
    {
      id: 2,
      title: 'Product B',
      price: 20,
      category: 'Cat2',
      rating: 3.5,
      thumbnail: '',
      images: [],
      description: '',
      discountPercentage: 0,
      stock: 10,
      brand: '',
    },
    {
      id: 3,
      title: 'Product C',
      price: 5,
      category: 'Cat1',
      rating: 5.0,
      thumbnail: '',
      images: [],
      description: '',
      discountPercentage: 0,
      stock: 10,
      brand: '',
    },
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: vi
        .fn()
        .mockReturnValue(of({ products: mockProducts, total: 3, skip: 0, limit: 30 })),
      searchProducts: vi
        .fn()
        .mockReturnValue(of({ products: [mockProducts[0]], total: 1, skip: 0, limit: 30 })),
      productsState: signal([]),
      searchQueryState: signal(''),
      selectedCategoriesState: signal(new Set()),
      sortOptionState: signal('featured'),
      currentPageState: signal(1),
      isStateInitialized: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [Productlist],
      providers: [provideRouter([]), { provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Productlist);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load products on init if state is not initialized', () => {
    mockProductService.isStateInitialized.set(false);
    fixture.detectChanges(); // triggers ngOnInit

    expect(mockProductService.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(3);
    expect(mockProductService.isStateInitialized()).toBe(true);
  });

  it('should NOT load products on init if state IS initialized', () => {
    mockProductService.isStateInitialized.set(true);
    mockProductService.productsState.set(mockProducts);
    fixture.detectChanges(); // triggers ngOnInit

    expect(mockProductService.getProducts).not.toHaveBeenCalled();
    expect(component.products().length).toBe(3);
  });

  it('should filter products by category', () => {
    fixture.detectChanges();
    // Set initial products
    component.products.set(mockProducts);

    // Toggle category 'Cat1'
    component.toggleCategory({ category: 'Cat1', isChecked: true });

    const filtered = component.filteredProducts();
    expect(filtered.length).toBe(2);
    expect(filtered.every((p) => p.category === 'Cat1')).toBe(true);
  });

  it('should sort products by price low to high', () => {
    fixture.detectChanges();
    component.products.set(mockProducts);

    // Change sort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.onSortChange({ target: { value: 'price-low-high' } } as any);

    const filtered = component.filteredProducts();
    expect(filtered[0].price).toBe(5);
    expect(filtered[1].price).toBe(10);
    expect(filtered[2].price).toBe(20);
  });

  it('should paginate products correctly', () => {
    fixture.detectChanges();
    component.products.set(mockProducts);
    component.pageSize.set(2); // Set page size to 2

    // Page 1
    component.currentPage.set(1);
    let paginated = component.paginatedProducts();
    expect(paginated.length).toBe(2);
    expect(paginated[0].id).toBe(1);
    expect(paginated[1].id).toBe(2);

    // Page 2
    component.changePage(2);
    paginated = component.paginatedProducts();
    expect(paginated.length).toBe(1);
    expect(paginated[0].id).toBe(3);
  });

  it('should search products', () => {
    vi.useFakeTimers();
    fixture.detectChanges();

    component.onSearch('Product A');
    vi.advanceTimersByTime(300); // Wait for debounce

    expect(mockProductService.searchProducts).toHaveBeenCalledWith('Product A');
    expect(component.products().length).toBe(1);
    expect(component.products()[0].title).toBe('Product A');

    vi.useRealTimers();
  });
});
