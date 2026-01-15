import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge.
 * Handles conditional classes, arrays, and resolves Tailwind CSS conflicts.
 * 
 * @param inputs - Class values to merge. Supports strings, arrays, objects, and conditional expressions.
 * @returns Merged class string with Tailwind conflicts resolved (last wins).
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500') // => 'text-red-500 bg-blue-500'
 * 
 * @example
 * // Conditional classes
 * cn('base', isActive && 'active', isDisabled && 'disabled')
 * 
 * @example
 * // Tailwind conflict resolution (last wins)
 * cn('p-2', 'p-4') // => 'p-4'
 * cn('bg-red-500', 'bg-blue-500') // => 'bg-blue-500'
 * 
 * @example
 * // Object syntax
 * cn({ 'text-bold': isBold, 'text-italic': isItalic })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
