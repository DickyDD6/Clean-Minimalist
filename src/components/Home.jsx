import React, { useMemo } from 'react';
import { Plus, Layout, CheckCircle, Clock, ListTodo } from 'lucide-react';

const Home = ({ boards, onSelectBoard, onCreateBoard }) => {
    const stats = useMemo(() => {
        return boards.reduce((acc, board) => {
            const allTasks = board.tasks ? Object.values(board.tasks).flat() : [];
            const doingTasks = board.tasks?.doing?.length || 0;
            const doneTasks = board.tasks?.done?.length || 0;

            return {
                total: acc.total + allTasks.length,
                doing: acc.doing + doingTasks,
                done: acc.done + doneTasks
            };
        }, { total: 0, doing: 0, done: 0 });
    }, [boards]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const getProgress = (count, total) => {
        if (!total) return 0;
        return (count / total) * 100;
    };

    const getTotalTasks = (board) => {
        if (!board.tasks) return 0;
        return Object.values(board.tasks).flat().length;
    };

    return (
        <div className="min-h-screen bg-slate-900 p-8 text-slate-50">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        {getGreeting()}, User!
                    </h1>
                    <p className="text-slate-400 font-medium">
                        Siap untuk melanjutkan produktivitas hari ini?
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors shadow-lg shadow-black/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <ListTodo size={24} />
                            </div>
                            <span className="text-slate-400 font-medium">Total Task</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors shadow-lg shadow-black/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                                <Clock size={24} />
                            </div>
                            <span className="text-slate-400 font-medium">Sedang Dikerjakan</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-100">{stats.doing}</p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors shadow-lg shadow-black/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-slate-400 font-medium">Selesai</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-100">{stats.done}</p>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                        <Layout size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">
                        Project Boards
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {boards.map(board => {
                        const totalTasks = getTotalTasks(board);

                        return (
                            <div
                                key={board.id}
                                onClick={() => onSelectBoard(board.id)}
                                className="bg-slate-800 hover:bg-slate-750 p-6 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden shadow-md shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Layout size={64} />
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors truncate pr-2">
                                        {board.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${board.type === 'standard'
                                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                        : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                        }`}>
                                        {board.type === 'standard' ? '📋 Std' : '⚡ Adv'}
                                    </span>
                                </div>
                                {board.description && (
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{board.description}</p>
                                )}
                                {!board.description && <div className="mb-4" />}

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
                                            <span>To Do</span>
                                            <span className="text-slate-300">{board.tasks?.todo?.length || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${getProgress(board.tasks?.todo?.length || 0, totalTasks)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
                                            <span>Doing</span>
                                            <span className="text-slate-300">{board.tasks?.doing?.length || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-amber-500 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${getProgress(board.tasks?.doing?.length || 0, totalTasks)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
                                            <span>Done</span>
                                            <span className="text-slate-300">{board.tasks?.done?.length || 0}</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: `${getProgress(board.tasks?.done?.length || 0, totalTasks)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={onCreateBoard}
                        className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 transition-all hover:bg-slate-800/50 min-h-[200px] group"
                    >
                        <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Plus size={32} />
                        </div>
                        <span className="font-medium">Tambah Project Baru</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
