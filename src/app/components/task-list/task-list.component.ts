import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskItem } from '../../models/task-item.model';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks/edit', id]);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks(); // Reload tasks after deletion
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          alert('Failed to delete task. Check console for details.');
        }
      });
    }
  }
}