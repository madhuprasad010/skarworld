import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Merge Tailwind class names safely with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric amount as currency (defaults to USD).
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  options?: { compact?: boolean; maximumFractionDigits?: number }
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0';
  }

  const fractionDigits = options?.maximumFractionDigits ?? (amount % 1 === 0 ? 0 : 2);

  if (options?.compact) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/**
 * Format numbers with comma grouping.
 */
export function formatNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format a number as percentage string (e.g. 42.5%).
 */
export function formatPercentage(value: number, decimals = 1): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0%';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers in compact human-readable format (e.g. 1.2K, 3.4M).
 */
export function formatCompactNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Extract up to two uppercase initials from a full name.
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate a cryptographically secure or pseudo-random unique ID.
 */
export function generateId(prefix = ''): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    const uuid = crypto.randomUUID();
    return prefix ? `${prefix}_${uuid}` : uuid;
  }
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
}

/**
 * Asynchronously wait for a given duration in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate a string to a specified maximum length and append an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Create a debounced version of a function that delays execution.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function debounced(...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Convert a Date instance or ISO string to a relative time string (e.g., "5 minutes ago").
 */
export function getRelativeTime(date: Date | string): string {
  if (!date) return '';

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) {
    const fallbackDate = new Date(date);
    if (!isValid(fallbackDate)) return String(date);
    return formatDistanceToNow(fallbackDate, { addSuffix: true });
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Slugify a string for URL friendliness.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Clamp a number between a minimum and a maximum.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Copy text to clipboard using the modern clipboard API with fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    return false;
  }
}
