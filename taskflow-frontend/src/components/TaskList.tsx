import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (task: Task) => void;
  deletingIds?: Set<number>;
  togglingIds?: Set<number>;
}

export const TaskList = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggle,
  deletingIds = new Set(),
  togglingIds = new Set()
}: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          isDeleting={deletingIds.has(task.id)}
          isToggling={togglingIds.has(task.id)}
        />
      ))}
    </div>
  );
};