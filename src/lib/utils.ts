
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @param formatStr - The format string to use (default: 'MMM d, yyyy')
 * @returns The formatted date string
 */
export function formatDate(dateString: string, formatStr = "MMM d, yyyy") {
  if (!dateString) return "Unknown date";
  try {
    return format(new Date(dateString), formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @returns The formatted currency string
 */
export function formatCurrency(amount: number | string, currency = "USD") {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return "$0.00";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Format a phone number to (xxx) xxx-xxxx format
 * @param phoneNumber - The phone number to format
 * @returns The formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return "";
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
}
