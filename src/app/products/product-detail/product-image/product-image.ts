import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product.interface';

/**
 * Product Image Component
 * Responsible for rendering the product's image(s).
 * Currently displays the main product image.
 */
@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image.html',
})
export class ProductImage {
  /**
   * The product whose image is to be displayed.
   * Required input.
   */
  @Input({ required: true }) product!: Product;
}
