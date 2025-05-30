import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  editCategory(id: number): void {
    this.router.navigate(['/categories/edit', id]);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category? (Note: Category cannot be deleted if tasks are associated with it)')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories(); // Reload categories after deletion
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          if (err.status === 400) { // Bad Request from API, indicating tasks are associated
            alert('Cannot delete category: Tasks are associated with this category. Please reassign or delete related tasks first.');
          } else {
            alert('Failed to delete category. Check console for details.');
          }
        }
      });
    }
  }
}