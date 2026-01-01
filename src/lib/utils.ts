import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string (YYYY-MM or YYYY) into a readable format (Jan 2024 or 2024)
 * Handles fallback for browsers without type="month" support.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';

  // Handle YYYY-MM format (standard for type="month")
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    try {
      const [year, month] = dateString.split('-');
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      const monthIdx = parseInt(month, 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${monthNames[monthIdx]} ${year}`;
      }
    } catch (e) {
      // Fall through
    }
  }

  // Handle just YYYY format
  if (/^\d{4}$/.test(dateString)) {
    return dateString;
  }

  // Fallback for any other unexpected strings
  return dateString;
}
