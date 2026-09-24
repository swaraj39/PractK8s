import { useState, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { taskApi } from './services/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from './types/task';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend is running on port 8080.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (data: CreateTaskRequest) => {
    try {
      setSubmitting(true);
      const newTask = await taskApi.create(data);
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateTaskRequest) => {
    if (!editingTask) return;
    try {
      setSubmitting(true);
      const updatedTask = await taskApi.update(editingTask.id, data);
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setDeletingIds(prev => new Set(prev).add(id));
      await taskApi.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      setTogglingIds(prev => new Set(prev).add(task.id));
      const updatedTask = await taskApi.update(task.id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error toggling task:', err);
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p className="subtitle">Task Management Application</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-dismiss">×</button>
          </div>
        )}

        <div className="toolbar">
          <button 
            className="btn btn-primary" 
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            disabled={showForm}
          >
            + New Task
          </button>
          <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>

        {showForm && (
          <div className="form-overlay" onClick={handleCancel}>
            <div className="form-modal" onClick={e => e.stopPropagation()}>
              <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <TaskForm
                initialData={editingTask || {}}
                onSubmit={(data) => editingTask ? handleUpdate(data as UpdateTaskRequest) : handleCreate(data as CreateTaskRequest)}
                onCancel={handleCancel}
                submitLabel={editingTask ? 'Update' : 'Create'}
                isLoading={submitting}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
            deletingIds={deletingIds}
            togglingIds={togglingIds}
          />
        )}
      </main>
    </div>
  );
}

export default App;