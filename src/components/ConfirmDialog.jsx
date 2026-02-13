import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="text-red-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-50 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-300">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-50 transition-colors text-sm font-medium"
                    >
                        Tidak
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium"
                    >
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
