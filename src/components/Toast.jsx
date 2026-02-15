import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'info', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 3000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500 border-emerald-600';
            case 'error':
                return 'bg-red-500 border-red-600';
            case 'warning':
                return 'bg-amber-500 border-amber-600';
            case 'info':
                return 'bg-indigo-500 border-indigo-600';
            default:
                return 'bg-slate-700 border-slate-600';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`${getToastStyles()} text-white px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}
        >
            {getIcon()}
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="text-white/80 hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={onClose}
                />
            ))}
        </div>
    );
};

export { Toast, ToastContainer };
export default ToastContainer;
