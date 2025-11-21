import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCard } from './product-card';
import { Product } from '../product.interface';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ProductCard', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test-image.jpg',
    images: ['test-image.jpg'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
    component.product = mockProduct;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display product details correctly', () => {
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('h3')).nativeElement;
    const priceEl = fixture.debugElement.query(By.css('.text-xl.font-bold')).nativeElement;
    const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;

    expect(titleEl.textContent).toContain(mockProduct.title);
    expect(priceEl.textContent).toContain('$99.99');
    expect(imgEl.src).toContain(mockProduct.thumbnail);
  });

  it('should show low stock badge when stock is below threshold', () => {
    // Assuming lowStockThreshold is 10 (default in environment)
    component.product = { ...mockProduct, stock: 3 };
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.bg-orange-700'));
    expect(badge).toBeTruthy();
    expect(badge.nativeElement.textContent).toContain('Low Stock');
  });

  it('should NOT show low stock badge when stock is above threshold', () => {
    component.product = { ...mockProduct, stock: 15 };
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.bg-orange-700'));
    expect(badge).toBeFalsy();
  });
});
