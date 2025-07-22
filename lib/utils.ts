import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This function formats a date to a human-readable string
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// this function formats a number to a currency string
// i want space between the currency symbol and the amount make it dymamic irrespective of the currency
// e.g. ₹ 1000 instead of ₹1000
// it uses the Indian numbering system
// and formats the number to two decimal places
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace("₹", "₹ ");
}
// This function formats a number to a percentage string
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}