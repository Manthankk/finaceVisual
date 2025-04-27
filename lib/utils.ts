import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatCurrencyOptions {
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}

export function formatCurrency(
  amount: number, 
  currency: string = 'USD', 
  options: FormatCurrencyOptions = {}
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}