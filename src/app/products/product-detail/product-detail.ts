import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.interface';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductImage } from './product-image/product-image';
import { ProductInfo } from './product-info/product-info';

/**
 * Product Detail Component
 * Displays the full details of a single product.
 * Fetches product data based on the route parameter 'id'.
 * Composes ProductImage and ProductInfo components.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Footer, ProductImage, ProductInfo],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  /**
   * Initializes the component.
   * Retrieves the product ID from the route and triggers data loading.
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    } else {
      this.error.set('Invalid product ID');
      this.isLoading.set(false);
    }
  }

  /**
   * Fetches product details by ID from the ProductService.
   * Updates loading and error states accordingly.
   * @param id The ID of the product to load.
   */
  loadProduct(id: number) {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product details.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Navigates back to the product list page.
   */
  goBack() {
    this.router.navigate(['/products']);
  }
}
