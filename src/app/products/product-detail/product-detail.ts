import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.interface';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { ProductImage } from './product-image/product-image';
import { ProductInfo } from './product-info/product-info';

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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    } else {
      this.error.set('Invalid product ID');
      this.isLoading.set(false);
    }
  }

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

  goBack() {
    this.router.navigate(['/products']);
  }
}
