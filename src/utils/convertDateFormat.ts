export function convertDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Number(now) - Number(date); // Difference in milliseconds

    const second = 1000;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
        const seconds = Math.floor(diff / second);
        return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diff < month) {
        const days = Math.floor(diff / day);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
        return date.toLocaleDateString(); // Directly show the date
    }
}

export const convertDateWithShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Number(now) - Number(date); // Difference in milliseconds

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const year = 365 * day;

    const isSameDay = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    if (isSameDay) {
        return "Today";
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (diff < year) {
        const weeks = Math.floor(diff / week);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else {
        const years = Math.floor(diff / year);
        return `${years} year${years > 1 ? 's' : ''}`;
    }
}

export const convertDateToReadableDate = (dateString: string) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (date.getFullYear() === now.getFullYear()) {
        return `${month} ${day} AT ${hours}:${minutes}`;
    } else {
        const year = date.getFullYear();
        return `${month} ${day}, ${year} AT ${hours}:${minutes}`;
    }
}

export default convertDate;