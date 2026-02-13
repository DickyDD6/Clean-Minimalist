import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import ConfirmDialog from './ConfirmDialog';
import TaskCard from './TaskCard';
import AddColumnModal from './AddColumnModal';

const KanbanBoard = ({ boardId, boardTitle, boardDescription, boardType = 'advanced', initialTasks = {}, columns = [], onTasksUpdate, onEditBoard, onAddColumn, onEditColumn, onDeleteColumn }) => {
    const [tasks, setTasks] = useState(() => {
        const defaultTasks = { todo: [], doing: [], done: [] };
        return { ...defaultTasks, ...(initialTasks || {}) };
    });

    const [availableTags, setAvailableTags] = useState(() => {
        const saved = localStorage.getItem('kanban-tags');
        if (saved) return JSON.parse(saved);
        return [
            { id: 'work', label: 'Work', color: 'purple' },
            { id: 'personal', label: 'Personal', color: 'pink' },
            { id: 'urgent', label: 'Urgent', color: 'orange' }
        ];
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [showAddColumn, setShowAddColumn] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        onTasksUpdate(tasks);
    }, [tasks, onTasksUpdate]);

    useEffect(() => {
        localStorage.setItem('kanban-tags', JSON.stringify(availableTags));
    }, [availableTags]);

    const addTask = (columnId, taskText, priority = 'medium', deadline = null, description = null, tags = []) => {
        if (!taskText.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            columnId,
            priority,
            deadline,
            description,
            tags
        };

        setTasks(prev => ({
            ...prev,
            [columnId]: [...(prev[columnId] || []), newTask]
        }));
    };

    const createTag = (newTag) => {
        setAvailableTags(prev => [...prev, newTag]);
    };

    const deleteTask = (columnId, taskId) => {
        setTasks(prev => ({
            ...prev,
            [columnId]: (prev[columnId] || []).filter(task => task.id !== taskId)
        }));
    };

    const editTask = (columnId, taskId, updatedTask) => {
        setTasks(prev => ({
            ...prev,
            [columnId]: (prev[columnId] || []).map(task =>
                task.id === taskId ? updatedTask : task
            )
        }));
    };

    const clearCompleted = () => {
        if (!tasks.done || tasks.done.length === 0) return;
        setShowConfirm(true);
    };

    const handleConfirmClear = () => {
        setTasks(prev => ({ ...prev, done: [] }));
        setShowConfirm(false);
    };

    const handleCancelClear = () => {
        setShowConfirm(false);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const draggedId = active.id;

        setActiveId(null);

        if (!over) return;

        const overId = over.id;

        const sourceColumn = Object.keys(tasks).find(key =>
            (tasks[key] || []).some(task => task.id === draggedId)
        );

        let targetColumn = overId;
        if (!columns.find(col => col.id === overId)) {
            targetColumn = Object.keys(tasks).find(key =>
                (tasks[key] || []).some(task => task.id === overId)
            );
        }

        if (!sourceColumn || !targetColumn) return;

        const taskToMove = (tasks[sourceColumn] || []).find(t => t.id === draggedId);
        if (!taskToMove) return;

        if (sourceColumn === targetColumn) {
            const columnTasks = tasks[sourceColumn] || [];
            const oldIndex = columnTasks.findIndex(t => t.id === draggedId);
            const newIndex = columnTasks.findIndex(t => t.id === overId);

            if (oldIndex !== newIndex) {
                const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
                setTasks(prev => ({ ...prev, [sourceColumn]: reorderedTasks }));
            }
        } else {
            const updatedTaskToMove = { ...taskToMove, columnId: targetColumn };
            setTasks(prev => ({
                ...prev,
                [sourceColumn]: (prev[sourceColumn] || []).filter(t => t.id !== draggedId),
                [targetColumn]: [...(prev[targetColumn] || []), updatedTaskToMove]
            }));
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const activeTask = activeId ?
        Object.values(tasks).flat().find(task => task && task.id === activeId) : null;

    const getTaskColumn = (taskId) => {
        for (const column of columns) {
            if ((tasks[column.id] || []).some(t => t.id === taskId)) {
                return column;
            }
        }
        return columns[0];
    };

    const activeColumn = activeTask ? getTaskColumn(activeTask.id) : null;

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-3 mb-1">
                        <h1 className="text-4xl font-bold text-slate-50">
                            {boardTitle}
                        </h1>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${boardType === 'standard'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                            }`}>
                            {boardType === 'standard' ? '📋 Standard' : '⚡ Advanced'}
                        </span>
                        <button
                            onClick={onEditBoard}
                            className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                            title="Edit Board"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </button>
                    </div>
                    {boardDescription && (
                        <p className="text-slate-400 mt-1 text-lg">{boardDescription}</p>
                    )}
                </div>

                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    sensors={sensors}
                >
                    <div className="flex gap-6 overflow-x-auto pb-4 items-start h-full">
                        {columns.map(column => (
                            <div key={column.id} className="min-w-[350px] flex-shrink-0">
                                <KanbanColumn
                                    column={column}
                                    tasks={tasks[column.id] || []}
                                    boardType={boardType}
                                    onAddTask={addTask}
                                    onDeleteTask={deleteTask}
                                    onEditTask={editTask}
                                    onClearCompleted={column.id === 'done' ? clearCompleted : undefined}
                                    availableTags={availableTags}
                                    onCreateTag={createTag}
                                    onEditColumn={(newTitle, newColor) => onEditColumn(boardId, column.id, newTitle, newColor)}
                                    onDeleteColumn={() => onDeleteColumn(boardId, column.id)}
                                />
                            </div>
                        ))}

                        {boardType === 'advanced' && (
                            <div className="min-w-[350px] flex-shrink-0">
                                <button
                                    onClick={() => setShowAddColumn(true)}
                                    className="w-full h-[100px] border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 hover:bg-slate-800/50 transition-all gap-2"
                                >
                                    <span className="text-2xl">+</span>
                                    <span className="font-medium">Tambah Kolom</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <DragOverlay>
                        {activeTask ? (
                            <div className="opacity-90 rotate-2 scale-105">
                                <TaskCard
                                    task={activeTask}
                                    accentColor={activeColumn?.color || 'border-indigo-500'}
                                    onDelete={() => { }}
                                    onEdit={() => { }}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Hapus Semua Task Selesai?"
                message={`Apakah Anda yakin ingin menghapus ${tasks.done?.length || 0} task yang sudah selesai? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleConfirmClear}
                onCancel={handleCancelClear}
            />

            <AddColumnModal
                isOpen={showAddColumn}
                onClose={() => setShowAddColumn(false)}
                onAddColumn={(title, color) => {
                    onAddColumn(boardId, title, color);
                    setShowAddColumn(false);
                }}
            />
        </div>
    );
};

export default KanbanBoard;
