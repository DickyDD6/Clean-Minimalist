import React, { useState } from 'react';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { compareDates, getRelativeTime, formatDisplayDate } from '../utils/dateUtils';
import EditTaskModal from './EditTaskModal';
import TagBadge from './TagBadge';
import ConfirmDialog from './ConfirmDialog';

const PRIORITY_CONFIG = {
    low: { label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    medium: { label: 'Med', color: 'bg-amber-500/20 text-amber-400 border-amber-500/50' },
    high: { label: 'High', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
};



const TaskCard = ({ task, accentColor, onDelete, onEdit, availableTags = [], onCreateTag, isCompleted }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

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

    const handleSave = (updatedTask) => {
        onEdit(updatedTask);
        setIsEditModalOpen(false);
    };

    const priority = task.priority || 'medium';
    const priorityConfig = PRIORITY_CONFIG[priority];

    const deadlineStatus = task.deadline ? compareDates(task.deadline) : null;
    const relativeTime = task.deadline ? getRelativeTime(task.deadline) : '';
    const displayDate = task.deadline ? formatDisplayDate(task.deadline) : '';

    // Get full tag objects from IDs
    const taskTags = (task.tags || []).map(tagId =>
        availableTags.find(t => t.id === tagId)
    ).filter(Boolean);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={`bg-slate-700 hover:bg-slate-600 rounded-lg p-3 border-l-4 ${accentColor} transition-colors ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
            >
                {/* Priority & Deadline Row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityConfig.color}`}>
                        {priorityConfig.label}
                    </span>

                    {/* Deadline/Status Badge */}
                    {(task.deadline && deadlineStatus) ? (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${isCompleted
                                ? (!task.completedAt || new Date(task.completedAt) <= new Date(task.deadline)
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' // On Time
                                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/50' // Late
                                )
                                : deadlineStatus === 'overdue' 
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                    : deadlineStatus === 'today'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                        : 'bg-green-500/20 text-green-400 border border-green-500/50'
                            }`}>
                            📅 {displayDate}
                            <span className="text-[10px] opacity-75">
                                ({isCompleted
                                    ? (!task.completedAt || new Date(task.completedAt) <= new Date(task.deadline) ? 'Tepat Waktu' : 'Terlambat')
                                    : relativeTime
                                })
                            </span>
                        </span>
                    ) : (
                        /* Show simple Done badge if completed but no deadline */
                        isCompleted && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                                ✅ Selesai
                            </span>
                        )
                    )}
                </div>

                {/* Tags Row */}
                {taskTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {taskTags.slice(0, 3).map(tag => (
                            <TagBadge key={tag.id} tag={tag} size="xs" />
                        ))}
                        {taskTags.length > 3 && (
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                +{taskTags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Task Text & Action Buttons */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-slate-50 text-sm flex-1">
                        {task.text}
                    </p>

                    <div className="flex gap-1 flex-shrink-0">
                        <button
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsEditModalOpen(true);
                            }}
                            className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                            title="Edit task"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowDeleteConfirm(true);
                            }}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            title="Delete task"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* More Detail (Collapsible) */}
                {(task.description || task.deadline || taskTags.length > 0) && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setShowDescription(!showDescription);
                            }}
                            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-300 transition-colors w-full text-left mb-2 p-1"
                            title="Toggle details"
                        >
                            {showDescription ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            <span className="font-medium">More Detail</span>
                        </button>

                        {showDescription && (
                            <div className="space-y-2 text-xs">
                                {/* Tags in Detail */}
                                {taskTags.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[60px]">Tags:</span>
                                        <div className="flex flex-wrap gap-1 flex-1">
                                            {taskTags.map(tag => (
                                                <TagBadge key={tag.id} tag={tag} size="xs" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Full Deadline Info */}
                                {task.deadline && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[60px]">Deadline:</span>
                                        <div className="flex-1">
                                            <div className="text-slate-300">
                                                📅 {new Date(task.deadline).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                            {/* Completed Date Display */}
                                            {isCompleted && task.completedAt && (
                                                <div className="text-slate-400 mb-1">
                                                    Selesai: {new Date(task.completedAt).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            )}
                                            
                                            <div className={`text-xs mt-0.5 ${isCompleted
                                                ? (task.deadline && task.completedAt && new Date(task.completedAt) > new Date(task.deadline) ? 'text-orange-400' : 'text-emerald-400')
                                                : deadlineStatus === 'overdue' ? 'text-red-400' :
                                                    deadlineStatus === 'today' ? 'text-amber-400' :
                                                        'text-green-400'
                                                }`}>
                                                {isCompleted
                                                    ? (task.deadline && task.completedAt && new Date(task.completedAt) > new Date(task.deadline) ? 'Selesai Terlambat' : 'Selesai')
                                                    : relativeTime
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                {task.description && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-500 min-w-[60px]">Deskripsi:</span>
                                        <p className="text-slate-300 leading-relaxed flex-1">
                                            {task.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Task Modal */}
            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                task={task}
                availableTags={availableTags}
                onCreateTag={onCreateTag}
            />

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Hapus Task?"
                message="Anda yakin ingin menghapus task ini? Tindakan ini tidak dapat dibatalkan."
                onConfirm={() => {
                    onDelete();
                    setShowDeleteConfirm(false);
                }}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
};

export default TaskCard;
