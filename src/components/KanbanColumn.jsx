import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

const KanbanColumn = ({ column, tasks, onAddTask, onDeleteTask, onEditTask, onClearCompleted }) => {
    const { setNodeRef } = useDroppable({
        id: column.id
    });

    const isDoneColumn = column.id === 'done';
    const isTodoColumn = column.id === 'todo';
    const hasCompletedTasks = isDoneColumn && tasks.length > 0;

    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-50">{column.title}</h2>
                <div className="flex items-center gap-2">
                    <span className="bg-slate-700 text-slate-400 px-2 py-1 rounded text-sm">
                        {tasks.length}
                    </span>
                    {hasCompletedTasks && (
                        <button
                            onClick={onClearCompleted}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-2 py-1 rounded text-sm transition-colors flex items-center gap-1"
                            title="Clear all completed tasks"
                        >
                            <Trash2 size={14} />
                            <span>Clear</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Only show AddTaskForm in To Do column */}
            {isTodoColumn && (
                <AddTaskForm
                    columnId={column.id}
                    onAddTask={onAddTask}
                    accentColor={column.color}
                />
            )}

            <div ref={setNodeRef} className={`space-y-3 min-h-[200px] ${isTodoColumn ? 'mt-4' : ''}`}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columnId={column.id}
                            accentColor={column.color}
                            onDelete={() => onDeleteTask(column.id, task.id)}
                            onEdit={(newText) => onEditTask(column.id, task.id, newText)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default KanbanColumn;
