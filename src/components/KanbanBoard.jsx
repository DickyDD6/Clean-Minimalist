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

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'border-indigo-500' },
    { id: 'doing', title: 'Doing', color: 'border-amber-500' },
    { id: 'done', title: 'Done', color: 'border-teal-500' }
];

const KanbanBoard = ({ boardTitle, initialTasks, onTasksUpdate }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [showConfirm, setShowConfirm] = useState(false);
    const [activeId, setActiveId] = useState(null);

    // Configure sensors for smoother dragging
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Notify parent when tasks change
    useEffect(() => {
        onTasksUpdate(tasks);
    }, [tasks, onTasksUpdate]);

    const addTask = (columnId, taskText, priority = 'medium') => {
        if (!taskText.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            columnId,
            priority
        };

        setTasks(prev => ({
            ...prev,
            [columnId]: [...prev[columnId], newTask]
        }));
    };

    const deleteTask = (columnId, taskId) => {
        setTasks(prev => ({
            ...prev,
            [columnId]: prev[columnId].filter(task => task.id !== taskId)
        }));
    };

    const editTask = (columnId, taskId, newText) => {
        if (!newText.trim()) return;

        setTasks(prev => ({
            ...prev,
            [columnId]: prev[columnId].map(task =>
                task.id === taskId ? { ...task, text: newText } : task
            )
        }));
    };

    const clearCompleted = () => {
        if (tasks.done.length === 0) {
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirmClear = () => {
        setTasks(prev => ({
            ...prev,
            done: []
        }));
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

        // Find source column
        const sourceColumn = Object.keys(tasks).find(key =>
            tasks[key].some(task => task.id === draggedId)
        );

        // Find target column
        let targetColumn = overId;
        if (!COLUMNS.find(col => col.id === overId)) {
            // If dropped on a task, find which column it belongs to
            targetColumn = Object.keys(tasks).find(key =>
                tasks[key].some(task => task.id === overId)
            );
        }

        if (!sourceColumn || !targetColumn) return;

        const taskToMove = tasks[sourceColumn].find(t => t.id === draggedId);

        if (sourceColumn === targetColumn) {
            // Reorder within same column
            const columnTasks = tasks[sourceColumn];
            const oldIndex = columnTasks.findIndex(t => t.id === draggedId);
            const newIndex = columnTasks.findIndex(t => t.id === overId);

            if (oldIndex !== newIndex) {
                const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
                setTasks(prev => ({
                    ...prev,
                    [sourceColumn]: reorderedTasks
                }));
            }
        } else {
            // Move to different column
            const updatedTaskToMove = { ...taskToMove, columnId: targetColumn };

            setTasks(prev => ({
                ...prev,
                [sourceColumn]: prev[sourceColumn].filter(t => t.id !== draggedId),
                [targetColumn]: [...prev[targetColumn], updatedTaskToMove]
            }));
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    // Get active task for DragOverlay
    const activeTask = activeId ?
        Object.values(tasks).flat().find(task => task.id === activeId) : null;

    // Get column color for active task
    const getTaskColumn = (taskId) => {
        for (const column of COLUMNS) {
            if (tasks[column.id].some(t => t.id === taskId)) {
                return column;
            }
        }
        return COLUMNS[0];
    };

    const activeColumn = activeTask ? getTaskColumn(activeTask.id) : null;

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-50 mb-8 text-center">
                    {boardTitle}
                </h1>

                <DndContext
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                    sensors={sensors}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {COLUMNS.map(column => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                tasks={tasks[column.id]}
                                onAddTask={addTask}
                                onDeleteTask={deleteTask}
                                onEditTask={editTask}
                                onClearCompleted={column.id === 'done' ? clearCompleted : undefined}
                            />
                        ))}
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
                message={`Apakah Anda yakin ingin menghapus ${tasks.done.length} task yang sudah selesai? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleConfirmClear}
                onCancel={handleCancelClear}
            />
        </div>
    );
};

export default KanbanBoard;
