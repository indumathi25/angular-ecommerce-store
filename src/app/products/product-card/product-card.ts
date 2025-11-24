import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../product.interface';
import { environment } from '../../../environments/environment';

/**
 * Product Card Component
 * Displays a summary of a product including its image, title, price, and stock status.
 * Used in product lists.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  /**
   * Whether this card should be treated as high priority (e.g., for image loading).
   * Defaults to false.
   */
  @Input() priority = false;

  /**
   * Threshold value to determine if the product is low on stock.
   * Imported from environment configuration.
   */
  lowStockThreshold = environment.lowStockThreshold;
}
