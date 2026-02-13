import React, { useState } from 'react';
import { X } from 'lucide-react';
import TagSelector from './TagSelector';

const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Med', color: 'bg-amber-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
];

const EditTaskModal = ({ isOpen, onClose, onSave, task, availableTags, onCreateTag }) => {
    const [taskText, setTaskText] = useState(task?.text || '');
    const [priority, setPriority] = useState(task?.priority || 'medium');
    const [deadline, setDeadline] = useState(task?.deadline || '');
    const [description, setDescription] = useState(task?.description || '');
    const [selectedTags, setSelectedTags] = useState(task?.tags || []);
    // Format for datetime-local input: YYYY-MM-DDThh:mm
    const [completedAt, setCompletedAt] = useState(
        task?.completedAt ? new Date(task.completedAt).toISOString().slice(0, 16) : ''
    );

    if (!isOpen || !task) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onSave({
                ...task,
                text: taskText,
                priority,
                deadline: deadline || null,
                description: description || null,
                tags: selectedTags,
                completedAt: completedAt ? new Date(completedAt).toISOString() : task.completedAt
            });
            onClose();
        }
    };

    const handleClose = () => {
        // Reset to original values on close without save
        setTaskText(task.text);
        setPriority(task.priority || 'medium');
        setDeadline(task.deadline || '');
        setDescription(task.description || '');
        setSelectedTags(task.tags || []);
        setCompletedAt(task.completedAt ? new Date(task.completedAt).toISOString().slice(0, 16) : '');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-50">Edit Task</h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Nama Task <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            placeholder="Masukkan nama task..."
                            autoFocus
                            className="w-full bg-slate-700 text-slate-50 placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Deskripsi
                            <span className="text-slate-500 text-xs ml-1">(opsional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tambahkan deskripsi singkat..."
                            rows={3}
                            className="w-full bg-slate-700 text-slate-50 placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tags
                            <span className="text-slate-500 text-xs ml-1">(opsional)</span>
                        </label>
                        <TagSelector
                            selectedTags={selectedTags}
                            availableTags={availableTags}
                            onTagsChange={setSelectedTags}
                            onCreateTag={onCreateTag}
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Prioritas
                        </label>
                        <div className="flex gap-2">
                            {PRIORITY_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setPriority(level.value)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${priority === level.value
                                        ? `${level.color} text-white`
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                        }`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Deadline
                            <span className="text-slate-500 text-xs ml-1">(opsional)</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full bg-slate-700 text-slate-50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                        />
                    </div>

                    {/* Completion Date (Only if task is completed) */}
                    {task.completedAt && (
                        <div className="pt-2 border-t border-slate-700">
                            <label className="block text-sm font-medium text-emerald-400 mb-2">
                                Tanggal Selesai
                            </label>
                            <input
                                type="datetime-local"
                                value={completedAt}
                                onChange={(e) => setCompletedAt(e.target.value)}
                                className="w-full bg-slate-900/50 border border-emerald-500/30 text-slate-50 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">
                                Ubah tanggal ini jika Anda lupa menandainya selesai kemarin.
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
