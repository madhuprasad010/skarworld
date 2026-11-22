import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatCompactNumber,
  getInitials,
  truncate,
  clamp,
} from '../lib/utils';

describe('Utility Functions', () => {
  it('cn merges class names properly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    expect(cn('p-4', false && 'hidden', 'm-2')).toBe('p-4 m-2');
  });

  it('formatCurrency formats USD correctly', () => {
    expect(formatCurrency(12500)).toBe('$12,500');
    expect(formatCurrency(0)).toBe('$0');
  });

  it('formatNumber formats numbers with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formatPercentage formats percentage values', () => {
    expect(formatPercentage(15.42)).toBe('15.4%');
  });

  it('formatCompactNumber compacts thousands and millions', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(2500000)).toBe('2.5M');
  });

  it('getInitials extracts name initials', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Skarworld')).toBe('SK');
  });

  it('truncate trims long strings with ellipsis', () => {
    expect(truncate('Hello World and Welcome', 10)).toBe('Hello Worl...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('clamp limits values to bounds', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
