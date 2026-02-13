import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import TagBadge from './TagBadge';
import { TAG_COLORS } from '../utils/tagColors';

const TagSelector = ({ selectedTags = [], availableTags = [], onTagsChange, onCreateTag }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].id);

    const handleToggleTag = (tagId) => {
        const isSelected = selectedTags.includes(tagId);

        if (isSelected) {
            onTagsChange(selectedTags.filter(id => id !== tagId));
        } else {
            onTagsChange([...selectedTags, tagId]);
        }
    };

    const handleCreateTag = () => {
        if (!newTagName.trim()) return;

        const newTag = {
            id: Date.now().toString(),
            label: newTagName.trim(),
            color: selectedColor
        };

        onCreateTag(newTag);
        onTagsChange([...selectedTags, newTag.id]);

        // Reset form
        setNewTagName('');
        setSelectedColor(TAG_COLORS[0].id);
        setShowCreateForm(false);
    };

    const selectedTagObjects = selectedTags
        .map(tagId => availableTags.find(t => t.id === tagId))
        .filter(Boolean); // Remove undefined

    return (
        <div className="relative">
            {/* Selected Tags Preview */}
            <div className="flex flex-wrap gap-1 mb-2">
                {selectedTagObjects.map(tag => (
                    <TagBadge
                        key={tag.id}
                        tag={tag}
                        size="sm"
                        showRemove
                        onRemove={() => handleToggleTag(tag.id)}
                    />
                ))}

                {selectedTagObjects.length === 0 && (
                    <span className="text-slate-500 text-xs">No tags selected</span>
                )}
            </div>

            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm flex items-center justify-between hover:bg-slate-600 transition-colors"
            >
                <span>Select Tags</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {/* Tag List */}
                    <div className="p-2">
                        {availableTags.length === 0 && !showCreateForm && (
                            <p className="text-slate-500 text-xs text-center py-2">
                                No tags yet. Create one!
                            </p>
                        )}

                        {availableTags.map(tag => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-2 p-2 hover:bg-slate-600 rounded cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={() => handleToggleTag(tag.id)}
                                    className="rounded border-slate-500 bg-slate-800 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                />
                                <TagBadge tag={tag} size="sm" />
                            </label>
                        ))}
                    </div>

                    {/* Create New Tag Form */}
                    {showCreateForm ? (
                        <div className="border-t border-slate-600 p-3 space-y-2">
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                placeholder="Tag name..."
                                className="w-full bg-slate-800 text-slate-50 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoFocus
                            />

                            {/* Color Picker */}
                            <div className="grid grid-cols-4 gap-2">
                                {TAG_COLORS.map(color => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setSelectedColor(color.id)}
                                        className={`${color.class} h-8 rounded transition-all ${selectedColor === color.id
                                                ? 'ring-2 ring-white scale-110'
                                                : 'hover:scale-105'
                                            }`}
                                        title={color.label}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                                >
                                    Create
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setNewTagName('');
                                    }}
                                    className="flex-1 bg-slate-600 hover:bg-slate-500 text-slate-300 px-3 py-1.5 rounded text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(true)}
                            className="w-full border-t border-slate-600 p-2 text-emerald-400 hover:bg-slate-600 text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Create New Tag</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagSelector;
