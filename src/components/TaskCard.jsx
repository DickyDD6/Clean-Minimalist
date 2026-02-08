import React, { useState } from 'react';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Pencil } from 'lucide-react';

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    medium: { label: 'Med', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
    high: { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
};

const TaskCard = ({ task, accentColor, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        animateLayoutChanges: defaultAnimateLayoutChanges,
        transition: {
            duration: 200,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
        opacity: isDragging ? 0 : 1,
    };

    const handleSave = () => {
        if (editText.trim() && editText !== task.text) {
            onEdit(editText);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(task.text);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const priority = task.priority || 'medium';
    const priorityConfig = PRIORITY_CONFIG[priority];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`bg-slate-700 hover:bg-slate-600 rounded-lg p-3 border-l-4 ${accentColor} transition-colors ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
        >
            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityConfig.color}`}>
                    {priorityConfig.label}
                </span>
            </div>

            <div className="flex items-start justify-between gap-2">
                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag when editing
                        autoFocus
                        className="flex-1 bg-slate-600 text-slate-50 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                ) : (
                    <p className="text-slate-50 text-sm flex-1">
                        {task.text}
                    </p>
                )}

                <div className="flex gap-1 flex-shrink-0">
                    {!isEditing && (
                        <button
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsEditing(true);
                            }}
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                    <button
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDelete();
                        }}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
