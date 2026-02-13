import React, { useState, useEffect } from 'react';
import { X, Layout, Layers } from 'lucide-react';

const EditBoardModal = ({ isOpen, onClose, board, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [boardType, setBoardType] = useState('standard');

    useEffect(() => {
        if (board) {
            setTitle(board.title || '');
            setDescription(board.description || '');
            setBoardType(board.type || 'advanced');
        }
    }, [board?.id]);

    if (!isOpen || !board) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onSave(board.id, { title: title.trim(), description, type: boardType });
        }
    };

    const canSwitchToStandard = !board.columns || board.columns.length <= 3;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-50">Edit Board</h2>
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
                            placeholder="Nama board..."
                            autoFocus
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Deskripsi</label>
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
                            <button
                                type="button"
                                disabled={!canSwitchToStandard}
                                onClick={() => setBoardType('standard')}
                                className={
                                    !canSwitchToStandard
                                        ? 'p-3 rounded-lg border-2 text-left transition-all border-slate-700 bg-slate-900 opacity-40 cursor-not-allowed'
                                        : boardType === 'standard'
                                            ? 'p-3 rounded-lg border-2 text-left transition-all border-indigo-500 bg-indigo-500/10'
                                            : 'p-3 rounded-lg border-2 text-left transition-all border-slate-700 bg-slate-900 hover:border-slate-600'
                                }
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Layout size={16} className={boardType === 'standard' && canSwitchToStandard ? 'text-indigo-400' : 'text-slate-400'} />
                                    <span className={boardType === 'standard' && canSwitchToStandard ? 'font-semibold text-sm text-indigo-300' : 'font-semibold text-sm text-slate-300'}>
                                        Standard
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">3 kolom tetap: To Do, Doing, Done.</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setBoardType('advanced')}
                                className={
                                    boardType === 'advanced'
                                        ? 'p-3 rounded-lg border-2 text-left transition-all border-violet-500 bg-violet-500/10'
                                        : 'p-3 rounded-lg border-2 text-left transition-all border-slate-700 bg-slate-900 hover:border-slate-600'
                                }
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <Layers size={16} className={boardType === 'advanced' ? 'text-violet-400' : 'text-slate-400'} />
                                    <span className={boardType === 'advanced' ? 'font-semibold text-sm text-violet-300' : 'font-semibold text-sm text-slate-300'}>
                                        Advanced
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">Kolom dinamis — tambah, ubah, hapus.</p>
                            </button>
                        </div>
                        {!canSwitchToStandard && (
                            <p className="text-xs text-amber-400/80 mt-2">
                                ⚠️ Board punya lebih dari 3 kolom — hapus dulu untuk beralih ke Standard
                            </p>
                        )}
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
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBoardModal;
