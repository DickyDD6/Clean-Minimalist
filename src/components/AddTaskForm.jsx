import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Med', color: 'bg-amber-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
];

const AddTaskForm = ({ columnId, onAddTask }) => {
    const [taskText, setTaskText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [showDescription, setShowDescription] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(
                columnId,
                taskText,
                priority,
                deadline || null,
                description || null
            );
            // Reset all fields
            setTaskText('');
            setPriority('medium');
            setDeadline('');
            setDescription('');
            setShowDescription(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            {/* Task Name Input */}
            <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Tambah task baru..."
                className="w-full bg-slate-700 text-slate-50 placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Description Textarea (Collapsible) */}
            {showDescription && (
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi task (opsional)..."
                    rows={2}
                    className="w-full bg-slate-700 text-slate-50 placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
            )}

            {/* Bottom Row: Priority, Deadline, Actions */}
            <div className="flex gap-2 items-center">
                {/* Priority Selector */}
                <div className="flex gap-1">
                    {PRIORITY_LEVELS.map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => setPriority(level.value)}
                            className={`px-2 py-1.5 rounded text-xs font-medium transition-all ${priority === level.value
                                    ? `${level.color} text-white`
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>

                {/* Deadline Picker */}
                <div className="relative flex-1">
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full bg-slate-700 text-slate-50 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 [color-scheme:dark]"
                    />
                </div>

                {/* Toggle Description Button */}
                <button
                    type="button"
                    onClick={() => setShowDescription(!showDescription)}
                    className={`px-2 py-1.5 rounded text-xs transition-colors ${showDescription
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                    title="Tambah deskripsi"
                >
                    📝
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Plus size={16} />
                </button>
            </div>
        </form>
    );
};

export default AddTaskForm;
