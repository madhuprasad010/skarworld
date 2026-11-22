import { apiClient, IS_DEV } from './api-client';
import { mockTasksHandlers } from '@/mock/handlers';
import type {
  Task,
  TaskFilters,
  CreateTaskDto,
  UpdateTaskDto,
  PaginatedResponse,
} from '@/types';

export class TasksService {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.getTasks(filters);
      }
      return await apiClient.get<PaginatedResponse<Task>>(
        '/tasks',
        filters as Record<string, string | number | boolean>
      );
    } catch (error) {
      console.error('[TasksService.getTasks] Error:', error);
      throw error;
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.getTask(id);
      }
      return await apiClient.get<Task>(`/tasks/${id}`);
    } catch (error) {
      console.error(`[TasksService.getTask] Error fetching task ${id}:`, error);
      throw error;
    }
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.createTask(data);
      }
      return await apiClient.post<Task>('/tasks', data);
    } catch (error) {
      console.error('[TasksService.createTask] Error:', error);
      throw error;
    }
  }

  async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.updateTask(id, data);
      }
      return await apiClient.patch<Task>(`/tasks/${id}`, data);
    } catch (error) {
      console.error(`[TasksService.updateTask] Error updating task ${id}:`, error);
      throw error;
    }
  }

  async completeTask(id: string): Promise<Task> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.completeTask(id);
      }
      return await apiClient.post<Task>(`/tasks/${id}/complete`);
    } catch (error) {
      console.error(`[TasksService.completeTask] Error completing task ${id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      if (IS_DEV) {
        return await mockTasksHandlers.deleteTask(id);
      }
      await apiClient.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      console.error(`[TasksService.deleteTask] Error deleting task ${id}:`, error);
      throw error;
    }
  }
}

export const tasksService = new TasksService();
