import React, { useState } from 'react';
import { X } from 'lucide-react';

const COLUMN_COLORS = [
    { id: 'indigo', label: 'Indigo', value: 'border-indigo-500', bg: 'bg-indigo-500' },
    { id: 'amber', label: 'Amber', value: 'border-amber-500', bg: 'bg-amber-500' },
    { id: 'emerald', label: 'Emerald', value: 'border-emerald-500', bg: 'bg-emerald-500' },
    { id: 'rose', label: 'Rose', value: 'border-rose-500', bg: 'bg-rose-500' },
    { id: 'sky', label: 'Sky', value: 'border-sky-500', bg: 'bg-sky-500' },
    { id: 'violet', label: 'Violet', value: 'border-violet-500', bg: 'bg-violet-500' },
    { id: 'orange', label: 'Orange', value: 'border-orange-500', bg: 'bg-orange-500' },
    { id: 'teal', label: 'Teal', value: 'border-teal-500', bg: 'bg-teal-500' },
    { id: 'pink', label: 'Pink', value: 'border-pink-500', bg: 'bg-pink-500' },
    { id: 'slate', label: 'Slate', value: 'border-slate-500', bg: 'bg-slate-500' },
];

const AddColumnModal = ({ isOpen, onClose, onAddColumn }) => {
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLUMN_COLORS[0].value);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onAddColumn(title, selectedColor);
            setTitle('');
            setSelectedColor(COLUMN_COLORS[0].value);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-50">Tambah Kolom Baru</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nama Kolom</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
                            placeholder="Contoh: Backlog, Review, Testing..."
                            autoFocus
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Warna Kolom</label>
                        <div className="flex flex-wrap gap-2">
                            {COLUMN_COLORS.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-8 h-8 rounded-full ${color.bg} transition-all ${selectedColor === color.value
                                            ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white scale-110'
                                            : 'opacity-60 hover:opacity-100'
                                        }`}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors font-medium"
                        >
                            Tambah Kolom
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddColumnModal;
