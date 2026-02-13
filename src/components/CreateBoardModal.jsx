import React, { useState } from 'react';
import { X, Layout, Layers } from 'lucide-react';

const BOARD_TYPES = [
    {
        id: 'standard',
        label: 'Standard',
        icon: Layout,
        color: 'indigo',
        description: '3 kolom tetap: To Do, Doing, Done. Simpel dan fokus.'
    },
    {
        id: 'advanced',
        label: 'Advanced',
        icon: Layers,
        color: 'violet',
        description: 'Kolom dinamis — tambah, ubah, dan hapus kolom sesuka hati.'
    }
];

const CreateBoardModal = ({ isOpen, onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [boardType, setBoardType] = useState('standard');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onCreate(title, description, boardType);
            setTitle('');
            setDescription('');
            setBoardType('standard');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-50">Buat Board Baru</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nama Board</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
                            placeholder="Contoh: Project Website"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Deskripsi (Opsional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none placeholder-slate-600"
                            placeholder="Deskripsi singkat board ini..."
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Tipe Board</label>
                        <div className="grid grid-cols-2 gap-3">
                            {BOARD_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = boardType === type.id;
                                const selectedStyles = type.id === 'standard'
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-violet-500 bg-violet-500/10';
                                const iconColor = type.id === 'standard' ? 'text-indigo-400' : 'text-violet-400';
                                const labelColor = type.id === 'standard' ? 'text-indigo-300' : 'text-violet-300';
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setBoardType(type.id)}
                                        className={`p-3 rounded-lg border-2 text-left transition-all ${isSelected
                                                ? selectedStyles
                                                : 'border-slate-700 hover:border-slate-600 bg-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon size={16} className={isSelected ? iconColor : 'text-slate-400'} />
                                            <span className={`font-semibold text-sm ${isSelected ? labelColor : 'text-slate-300'}`}>
                                                {type.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
                                    </button>
                                );
                            })}
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
                            Buat Board
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;
