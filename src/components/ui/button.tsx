/**
 * @fileoverview Button - Reusable button component with multiple variants and sizes.
 * 
 * Based on shadcn/ui patterns with class-variance-authority for variant management.
 * Supports polymorphic rendering via `asChild` prop using Radix UI Slot.
 * 
 * @module components/ui/button
 * @see {@link https://ui.shadcn.com/docs/components/button} - shadcn/ui Button
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button variant definitions using class-variance-authority.
 * 
 * @variant default - Primary filled button with brand color
 * @variant destructive - Red destructive action button
 * @variant outline - Bordered button with transparent background
 * @variant secondary - Muted secondary action button
 * @variant ghost - Transparent button with hover effect
 * @variant link - Text-only styled as hyperlink
 * 
 * @size default - Standard 36px height button
 * @size sm - Small 32px height button
 * @size lg - Large 40px height button
 * @size icon - Square icon-only button (36px)
 * @size icon-sm - Small square icon button (32px)
 * @size icon-lg - Large square icon button (40px)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the Button component.
 * Extends native button props with variant, size, and asChild options.
 */
interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, renders child element as the button (polymorphic).
   * Useful for rendering links styled as buttons.
   * @default false
   */
  asChild?: boolean
}

/**
 * Versatile button component with multiple variants and sizes.
 * 
 * @component
 * @example
 * // Default button
 * <Button>Click me</Button>
 * 
 * @example
 * // Destructive variant
 * <Button variant="destructive">Delete</Button>
 * 
 * @example
 * // As a link
 * <Button asChild>
 *   <a href="/page">Go to page</a>
 * </Button>
 * 
 * @example
 * // Icon button
 * <Button size="icon" variant="ghost">
 *   <MenuIcon />
 * </Button>
 */
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

