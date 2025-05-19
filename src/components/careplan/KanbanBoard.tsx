import React from 'react';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface KanbanTask {
  id: string;
  title: string;
  status: TaskStatus;
  type: 'assessment' | 'intervention' | 'evaluation';
  assignee?: string;
  priority?: string;
  epicId?: string;
}

export interface KanbanEpic {
  id: string;
  title: string;
}

interface KanbanBoardProps {
  tasks: KanbanTask[];
  epics: KanbanEpic[];
  enableSimulations?: boolean;
  onTaskStatusChange?: (id: string, status: TaskStatus) => void;
  onTaskAssign?: (id: string, assignee: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div key={task.id} className="bg-slate-900 p-3 rounded border border-slate-700">
          <div className="font-semibold text-slate-100">{task.title}</div>
          <div className="text-xs text-slate-400">{task.status}</div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
