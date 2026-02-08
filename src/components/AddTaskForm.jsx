import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const PRIORITY_LEVELS = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Med', color: 'bg-amber-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
];

const AddTaskForm = ({ columnId, onAddTask }) => {
    const [taskText, setTaskText] = useState('');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(columnId, taskText, priority);
            setTaskText('');
            setPriority('medium'); // Reset to default
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Tambah task baru..."
                className="w-full bg-slate-700 text-slate-50 placeholder-slate-400 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <div className="flex gap-2">
                {/* Priority Selector */}
                <div className="flex gap-1 flex-1">
                    {PRIORITY_LEVELS.map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => setPriority(level.value)}
                            className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${priority === level.value
                                    ? `${level.color} text-white`
                                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>

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
