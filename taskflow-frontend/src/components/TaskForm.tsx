import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { CreateTaskRequest, UpdateTaskRequest } from '../types/task';

interface TaskFormProps {
  initialData?: Partial<CreateTaskRequest & UpdateTaskRequest & { id?: number }>;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  onCancel?: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

export const TaskForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  submitLabel,
  isLoading = false 
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [completed, setCompleted] = useState(initialData.completed || false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }
    if (description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ title: title.trim(), description: description.trim(), completed });
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className={errors.title ? 'error' : ''}
          placeholder="Enter task title"
          disabled={isLoading}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className={errors.description ? 'error' : ''}
          placeholder="Enter task description (optional)"
          rows={4}
          disabled={isLoading}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {initialData.id && (
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCompleted(e.target.checked)}
              disabled={isLoading}
            />
            Completed
          </label>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};