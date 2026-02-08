import React, { useState } from 'react';
import { PanelLeft, Plus, Trash2, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ boards, activeBoard, onSelectBoard, onAddBoard, onDeleteBoard, onEditBoard }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEditStart = (board) => {
        setEditingId(board.id);
        setEditText(board.title);
    };

    const handleEditSave = () => {
        if (editText.trim() && editingId) {
            onEditBoard(editingId, editText);
        }
        setEditingId(null);
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEditSave();
        } else if (e.key === 'Escape') {
            handleEditCancel();
        }
    };

    return (
        <div
            className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Header dengan Toggle Button */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                {!isCollapsed && (
                    <h2 className="text-slate-50 font-semibold text-lg">Boards</h2>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-slate-50 transition-colors"
                >
                    <PanelLeft size={20} />
                </button>
            </div>

            {/* New Board Button */}
            <div className="p-3">
                <button
                    onClick={onAddBoard}
                    className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${isCollapsed ? 'p-3' : 'p-2.5'
                        }`}
                    title="New Board"
                >
                    <Plus size={18} />
                    {!isCollapsed && <span className="text-sm font-medium">New Board</span>}
                </button>
            </div>

            {/* Board List */}
            <div className="flex-1 overflow-y-auto p-2">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className={`group mb-1 rounded-lg transition-all ${activeBoard === board.id
                                ? 'bg-emerald-500 text-white'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-2 p-2.5">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <LayoutDashboard size={18} />
                            </div>

                            {/* Board Title atau Edit Input */}
                            {!isCollapsed && (
                                <>
                                    {editingId === board.id ? (
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={handleEditSave}
                                            autoFocus
                                            className="flex-1 bg-slate-600 text-slate-50 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    ) : (
                                        <button
                                            onClick={() => onSelectBoard(board.id)}
                                            onDoubleClick={() => handleEditStart(board)}
                                            className="flex-1 text-left text-sm font-medium truncate"
                                        >
                                            {board.title}
                                        </button>
                                    )}

                                    {/* Delete Button (visible on hover) */}
                                    {boards.length > 1 && activeBoard !== board.id && editingId !== board.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteBoard(board.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400"
                                            title="Delete Board"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            {!isCollapsed && (
                <div className="p-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500 text-center">
                        {boards.length} board{boards.length !== 1 ? 's' : ''} • Double-click to rename
                    </p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
