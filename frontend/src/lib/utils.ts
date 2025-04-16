import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Compares two date strings by their date portion only (ignores time)
 *
 * @param {string | null | undefined} date1 - First date string in ISO format (e.g., "2023-01-15T10:00:00Z")
 * @param {string | null | undefined} date2 - Second date string in ISO format
 * @returns {boolean} - Returns:
 *   - `false` if both dates are null/undefined or have the same date portion
 *   - `true` if one date is null/undefined while the other isn't,
 *     or if their date portions differ
 */
export const compareDates = (date1: string, date2: string) => {
	// If both are null/undefined, consider them equal
	if (!date1 && !date2) return true;
	// If one is null/undefined and the other isn't, they're different
	if (!date1 || !date2) return false;

	// Compare date portions (ignoring time)
	return date1.split('T')[0] === date2.split('T')[0];
};
