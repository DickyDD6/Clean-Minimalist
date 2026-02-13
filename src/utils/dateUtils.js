// Date utility functions for deadline handling
// Updated to handle full date & time (YYYY-MM-DDTHH:mm)

/**
 * Compare deadline with current time to determine status
 * @param {string} deadline - Deadline in ISO format (YYYY-MM-DD or YYYY-MM-DDTHH:mm)
 * @returns {'overdue'|'today'|'upcoming'|null} Deadline status
 */
export const compareDates = (deadline) => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const now = new Date();

    // Check if deadline has passed (considering time)
    if (deadlineDate < now) {
        return 'overdue';
    }

    // Check if it's the same day
    if (deadlineDate.toDateString() === now.toDateString()) {
        return 'today';
    }

    return 'upcoming';
};

/**
 * Get relative time text in Indonesian
 * @param {string} deadline - Deadline in ISO format
 * @returns {string} Relative time text (e.g., "dalam 2 jam", "besok, 10:00")
 */
export const getRelativeTime = (deadline) => {
    if (!deadline) return '';

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffMs = deadlineDate - now;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Overdue logic
    if (diffMs < 0) {
        const absDiffMinutes = Math.abs(diffMinutes);
        const absDiffHours = Math.abs(diffHours);
        const absDiffDays = Math.abs(diffDays);

        if (absDiffMinutes < 60) return `terlambat ${absDiffMinutes} menit`;
        if (absDiffHours < 24) return `terlambat ${absDiffHours} jam`;
        return `terlambat ${absDiffDays} hari`;
    }

    // Upcoming logic
    if (diffMinutes < 60) return `dalam ${diffMinutes} menit`;
    if (diffHours < 24 && deadlineDate.getDate() === now.getDate()) return `hari ini, ${deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1 || (diffHours < 24 && deadlineDate.getDate() !== now.getDate())) return `besok, ${deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    
    return `dalam ${diffDays} hari`;
};

/**
 * Format date for display (DD MMM HH:mm)
 * @param {string} dateString - Date string in ISO format
 * @returns {string} Formatted date (e.g., "15 Feb 14:30")
 */
export const formatDisplayDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Check if time exists (not 00:00 default)
    // Actually, datetime-local usually sets time. If it was just date (task lama), it defaults to 00:00 (UTC) or local 07:00.
    // We will show time anyway for consistency, or we could strict check if input had time.
    // For simplicity and since we moved to datetime-local, we show time.
    
    return `${day} ${month} ${time}`;
};
