import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../product.interface';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
  @Input() priority = false;
  lowStockThreshold = environment.lowStockThreshold;
}
