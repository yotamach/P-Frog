import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "shadow hover:opacity-90",
        destructive:
          "shadow-sm hover:opacity-90",
        outline:
          "border shadow-sm",
        secondary:
          "shadow-sm hover:opacity-80",
        ghost: "",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-10 rounded px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const getVariantStyles = () => {
      switch (variant) {
        case 'destructive':
          return {
            backgroundColor: 'var(--color-button-destructive)',
            color: 'var(--color-button-destructive-foreground)',
          };
        case 'outline':
          return {
            borderColor: 'var(--color-button-outline-border)',
            backgroundColor: 'var(--color-button-outline)',
            color: 'var(--color-button-outline-foreground)',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--color-button-secondary)',
            color: 'var(--color-button-secondary-foreground)',
          };
        case 'ghost':
          return {
            color: 'var(--color-button-ghost-foreground)',
          };
        case 'link':
          return {
            color: 'var(--color-button-link)',
          };
        default:
          return {
            backgroundColor: 'var(--color-button-primary)',
            color: 'var(--color-button-primary-foreground)',
          };
      }
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{ ...getVariantStyles(), ...style }}
        ref={ref as any}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
