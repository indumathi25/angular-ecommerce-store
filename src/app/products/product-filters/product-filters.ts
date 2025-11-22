import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Product Filters Component
 * Renders a list of category checkboxes to filter the product list.
 * Emits events when categories are selected or deselected.
 */
@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filters.html',
})
export class ProductFilters {
  @Input({ required: true }) categories: string[] = [];
  @Input({ required: true }) selectedCategories: Set<string> = new Set();

  /**
   * Event emitted when a category checkbox is toggled.
   * Payload contains the category name and its new checked state.
   */
  @Output() categoryChange = new EventEmitter<{ category: string; isChecked: boolean }>();

  /**
   * Handles the checkbox toggle event.
   * Emits the categoryChange event with the updated state.
   * @param category The name of the category being toggled.
   * @param event The DOM event triggered by the checkbox.
   */
  onToggle(category: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.categoryChange.emit({ category, isChecked });
  }
}
