export interface TaskItem {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled'; // Matches backend enum string
  categoryId: number;
  categoryName: string;
}

export interface CreateTaskItem {
  title: string;
  description: string;
  dueDate: Date;
  categoryId: number;
}

export interface UpdateTaskItem {
  title: string;
  description: string;
  dueDate: Date;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  categoryId: number;
}