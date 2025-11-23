import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product.interface';

/**
 * Product Info Component
 * Displays detailed information about a product, such as description, price, rating, and stock.
 * Part of the product detail view.
 */
@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-info.html',
})
export class ProductInfo {
  /**
   * The product object containing details to display.
   * Required input.
   */
  @Input({ required: true }) product!: Product;
}
