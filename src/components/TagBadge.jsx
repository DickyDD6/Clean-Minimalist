import React from 'react';
import { X } from 'lucide-react';
import { getTagColorClass } from '../utils/tagColors';

const TagBadge = ({ tag, onRemove, size = 'sm', showRemove = false }) => {
    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-[10px]',
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm'
    };

    const colorClass = getTagColorClass(tag.color);

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full ${colorClass} text-white font-medium ${sizeClasses[size]}`}
        >
            <span>{tag.label}</span>

            {showRemove && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(tag.id);
                    }}
                    className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                    title={`Remove ${tag.label}`}
                >
                    <X size={12} />
                </button>
            )}
        </span>
    );
};

export default TagBadge;
