import React, { useState } from 'react';
import { PanelLeft, Plus, Trash2, LayoutDashboard, Home } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const Sidebar = ({ boards, activeBoard, currentView, onGoHome, onSelectBoard, onAddBoard, onDeleteBoard, onEditBoard }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);

    return (
        <div
            className={`bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'
                }`}
        >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                {!isCollapsed && (
                    <h1 className="text-lg font-bold text-slate-50 tracking-wide">
                        📋 My Boards
                    </h1>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-slate-50 transition-colors p-1 rounded hover:bg-slate-700"
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                    <PanelLeft size={20} />
                </button>
            </div>

            <div className="p-2">
                <button
                    onClick={onGoHome}
                    className={`w-full flex items-center gap-2 rounded-lg transition-all ${isCollapsed ? 'p-3 justify-center' : 'p-2.5'
                        } ${currentView === 'home'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-300 hover:bg-slate-700'
                        }`}
                    title="Home"
                >
                    <Home size={18} />
                    {!isCollapsed && <span className="text-sm font-medium">Home</span>}
                </button>
            </div>

            <div className="px-2 mb-2">
                <div className="border-t border-slate-700 my-2" />
                <button
                    onClick={onAddBoard}
                    className={`w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 border-dashed rounded-lg transition-all flex items-center justify-center gap-2 ${isCollapsed ? 'p-3' : 'p-2'
                        }`}
                    title="New Board"
                >
                    <Plus size={18} />
                    {!isCollapsed && <span className="text-sm font-medium">New Board</span>}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className={`group mb-1 rounded-lg transition-all ${currentView === 'board' && activeBoard === board.id
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-300 hover:bg-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-2 p-2.5">
                            <div className="flex-shrink-0">
                                <LayoutDashboard size={18} />
                            </div>

                            {!isCollapsed && (
                                <>
                                    <button
                                        onClick={() => onSelectBoard(board.id)}
                                        className="flex-1 text-left text-sm font-medium truncate"
                                    >
                                        {board.title}
                                    </button>

                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditBoard(board.id);
                                            }}
                                            className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                                            title="Edit Board"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                        {boards.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.stopPropagation();
                                                    setBoardToDelete(board);
                                                }}
                                                className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                                                title="Delete Board"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!isCollapsed && (
                <div className="p-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500 text-center">
                        {boards.length} board{boards.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!boardToDelete}
                title="Hapus Board?"
                message={`Anda yakin ingin menghapus board "${boardToDelete?.title}"? Semua list dan task di dalamnya akan hilang permanen.`}
                onConfirm={() => {
                    if (boardToDelete) onDeleteBoard(boardToDelete.id);
                    setBoardToDelete(null);
                }}
                onCancel={() => setBoardToDelete(null)}
            />
        </div>
    );
};

export default Sidebar;
