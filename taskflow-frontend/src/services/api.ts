import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

const api = axios.create({
  baseURL: '/api/tasks',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('');
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/${id}`);
    return response.data;
  },

  create: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>('', task);
    return response.data;
  },

  update: async (id: number, task: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/${id}`, task);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },
};