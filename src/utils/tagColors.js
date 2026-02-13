// Preset color palette for tags (prevents "painful" color choices)
export const TAG_COLORS = [
    { id: 'purple', class: 'bg-purple-500', label: 'Purple' },
    { id: 'pink', class: 'bg-pink-500', label: 'Pink' },
    { id: 'orange', class: 'bg-orange-500', label: 'Orange' },
    { id: 'cyan', class: 'bg-cyan-500', label: 'Cyan' },
    { id: 'lime', class: 'bg-lime-500', label: 'Lime' },
    { id: 'rose', class: 'bg-rose-500', label: 'Rose' },
    { id: 'violet', class: 'bg-violet-500', label: 'Violet' },
    { id: 'teal', class: 'bg-teal-500', label: 'Teal' }
];

// Get color class from tag color ID
export const getTagColorClass = (colorId) => {
    const color = TAG_COLORS.find(c => c.id === colorId);
    return color ? color.class : 'bg-gray-500'; // fallback
};
