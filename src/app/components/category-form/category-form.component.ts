import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category, CreateCategory, UpdateCategory } from '../../models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoryId = +id;
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number): void {
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description
        });
      },
      error: (err) => {
        console.error('Error loading category:', err);
        this.router.navigate(['/categories']); // Navigate back if category not found
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.categoryForm.value;

    if (this.isEditMode && this.categoryId) {
      const updatedCategory: UpdateCategory = {
        name: formValue.name,
        description: formValue.description
      };
      this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          console.error('Error updating category:', err);
          alert('Failed to update category. Check console for details.');
        }
      });
    } else {
      const newCategory: CreateCategory = {
        name: formValue.name,
        description: formValue.description
      };
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          console.error('Error creating category:', err);
          alert('Failed to create category. Check console for details.');
        }
      });
    }
  }
}