import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2, Plus, MoreVertical } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import ConfirmDialog from './ConfirmDialog';

const KanbanColumn = ({ column, tasks, onAddTask, onDeleteTask, onEditTask, onClearCompleted, availableTags, onCreateTag, onEditColumn, onDeleteColumn, boardType = 'advanced' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editTitle, setEditTitle] = useState(column.title);

    const { setNodeRef } = useDroppable({
        id: column.id
    });

    const handleSaveTitle = () => {
        if (editTitle.trim() && editTitle !== column.title) {
            onEditColumn(editTitle, column.color);
        }
        setIsEditing(false);
    };

    const isDoneColumn = column.id === 'done';
    const isTodoColumn = column.id === 'todo';
    const hasCompletedTasks = isDoneColumn && tasks.length > 0;

    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') setIsEditing(false);
                        }}
                        autoFocus
                        className="bg-slate-700 text-slate-50 px-2 py-1 rounded text-sm w-full mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                ) : (
                    <h2
                        className={`text-xl font-semibold text-slate-50 ${boardType === 'advanced' ? 'cursor-pointer hover:text-indigo-400' : ''} transition-colors`}
                        onClick={() => boardType === 'advanced' && setIsEditing(true)}
                        title={boardType === 'advanced' ? 'Click to rename' : ''}
                    >
                        {column.title}
                    </h2>
                )}

                <div className="flex items-center gap-2">
                    <span className="bg-slate-700 text-slate-400 px-2 py-1 rounded text-sm">
                        {tasks.length}
                    </span>

                    {boardType === 'advanced' && (
                        <div className="relative group">
                            <button className="text-slate-400 hover:text-slate-200 p-1">
                                <MoreVertical size={18} />
                            </button>

                            <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 hidden group-hover:block">
                                <div className="p-1">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded hover:bg-opacity-50 flex items-center gap-2"
                                    >
                                        <span>✎</span> Rename
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded flex items-center gap-2"
                                    >
                                        <span>🗑</span> Delete Column
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white p-1 rounded transition-colors"
                        title="Add Task"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div ref={setNodeRef} className="space-y-3 min-h-[200px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columnId={column.id}
                            accentColor={column.color}
                            onDelete={() => onDeleteTask(column.id, task.id)}
                            onEdit={(newText) => onEditTask(column.id, task.id, newText)}
                            availableTags={availableTags}
                            onCreateTag={onCreateTag}
                            isCompleted={column.id === 'done'}
                        />
                    ))}
                </SortableContext>
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddTask={onAddTask}
                columnId={column.id}
                availableTags={availableTags}
                onCreateTag={onCreateTag}
            />

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Hapus Kolom?"
                message={`Anda yakin ingin menghapus kolom "${column.title}"? Semua task di dalamnya akan ikut terhapus.`}
                onConfirm={() => {
                    onDeleteColumn();
                    setShowDeleteConfirm(false);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    );
};

export default KanbanColumn;
