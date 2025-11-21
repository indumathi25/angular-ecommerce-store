import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Productlist } from './productlist';
import { ProductService } from './product.service';

describe('Productlist', () => {
  let component: Productlist;
  let fixture: ComponentFixture<Productlist>;
  let mockProductService: any;

  beforeEach(async () => {
    mockProductService = {
      getProducts: vi.fn().mockReturnValue(of({ products: [], total: 0, skip: 0, limit: 0 })),
      searchProducts: vi.fn().mockReturnValue(of({ products: [], total: 0, skip: 0, limit: 0 })),
    };

    await TestBed.configureTestingModule({
      imports: [Productlist],
      providers: [provideRouter([]), { provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Productlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
