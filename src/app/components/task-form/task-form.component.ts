import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule  } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { TaskItem, CreateTaskItem, UpdateTaskItem } from '../../models/task-item.model';
import { Category } from '../../models/category.model';
import { TaskStatus } from '../../shared/task-status.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  categories: Category[] = [];
  taskStatuses = Object.values(TaskStatus); // Get all enum values as strings

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [this.formatDate(new Date()), Validators.required], // Set default to today + 7 days
      categoryId: ['', Validators.required],
      status: [TaskStatus.Pending, Validators.required] // Default status for new tasks
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taskId = +id;
        this.loadTask(this.taskId);
      } else {
        // For new tasks, set default status to Pending and disable the status control
        this.taskForm.get('status')?.disable();
      }
    });
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

  loadTask(id: number): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        // Format date for input type="date"
        const formattedDate = this.formatDate(new Date(task.dueDate));
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: formattedDate,
          categoryId: task.categoryId,
          status: task.status
        });
      },
      error: (err) => {
        console.error('Error loading task:', err);
        // Handle error, e.g., navigate back or show a message
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched(); // Show validation errors
      return;
    }

    const formValue = this.taskForm.getRawValue(); // Use getRawValue to get disabled field values

    if (this.isEditMode && this.taskId) {
      const updatedTask: UpdateTaskItem = {
        title: formValue.title,
        description: formValue.description,
        dueDate: new Date(formValue.dueDate),
        categoryId: formValue.categoryId,
        status: formValue.status
      };
      this.taskService.updateTask(this.taskId, updatedTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          alert('Failed to update task. Check console for details.');
        }
      });
    } else {
      const newTask: CreateTaskItem = {
        title: formValue.title,
        description: formValue.description,
        dueDate: new Date(formValue.dueDate),
        categoryId: formValue.categoryId
      };
      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error creating task:', err);
          alert('Failed to create task. Check console for details.');
        }
      });
    }
  }

  // Helper to format date for input type="date"
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}