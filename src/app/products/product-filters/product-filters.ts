import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filters.html',
})
export class ProductFilters {
  @Input({ required: true }) categories: string[] = [];
  @Input({ required: true }) selectedCategories: Set<string> = new Set();
  @Output() categoryChange = new EventEmitter<{ category: string; isChecked: boolean }>();

  onToggle(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.categoryChange.emit({ category, isChecked });
  }
}
