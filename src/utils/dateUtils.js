// Date utility functions for deadline handling
// Prevents timezone bugs by stripping time component

/**
 * Strip time from date, keep date only at 00:00:00
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {Date|null} Date object at 00:00:00 or null
 */
export const stripTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Get today's date at 00:00:00
 * @returns {Date} Today at midnight
 */
export const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Compare deadline with today to determine status
 * @param {string} deadline - Deadline in YYYY-MM-DD format
 * @returns {'overdue'|'today'|'upcoming'|null} Deadline status
 */
export const compareDates = (deadline) => {
    if (!deadline) return null;

    const deadlineDate = stripTime(deadline);
    const today = getToday();

    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    return 'upcoming';
};

/**
 * Get relative time text in Indonesian
 * @param {string} deadline - Deadline in YYYY-MM-DD format
 * @returns {string} Relative time text (e.g., "dalam 3 hari", "hari ini")
 */
export const getRelativeTime = (deadline) => {
    if (!deadline) return '';

    const deadlineDate = stripTime(deadline);
    const today = getToday();

    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `terlambat ${Math.abs(diffDays)} hari`;
    if (diffDays === 0) return 'hari ini';
    if (diffDays === 1) return 'besok';
    return `dalam ${diffDays} hari`;
};

/**
 * Format date for display (DD MMM format)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "15 Feb")
 */
export const formatDisplayDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${day} ${month}`;
};

/**
 * Get deadline badge style based on status
 * @param {string} deadline - Deadline in YYYY-MM-DD format
 * @returns {object} Badge style configuration
 */
export const getDeadlineStyle = (deadline) => {
    const status = compareDates(deadline);

    const styles = {
        overdue: {
            color: 'bg-red-500/20 text-red-400 border-red-500/50',
            icon: '🔴',
            label: 'Terlambat'
        },
        today: {
            color: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
            icon: '🟠',
            label: 'Hari Ini'
        },
        upcoming: {
            color: 'bg-green-500/20 text-green-400 border-green-500/50',
            icon: '🟢',
            label: 'Akan Datang'
        }
    };

    return styles[status] || null;
};
