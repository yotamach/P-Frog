import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent shadow",
        secondary:
          "border-transparent",
        destructive:
          "border-transparent shadow",
        outline: "text-foreground",
        success:
          "border-transparent shadow",
        warning:
          "border-transparent shadow",
        info:
          "border-transparent shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'hsl(142 71% 45% / 0.15)',
          color: 'hsl(142 71% 35%)',
          borderColor: 'hsl(142 71% 45% / 0.3)',
        };
      case 'warning':
        return {
          backgroundColor: 'hsl(38 92% 50% / 0.15)',
          color: 'hsl(38 92% 40%)',
          borderColor: 'hsl(38 92% 50% / 0.3)',
        };
      case 'info':
        return {
          backgroundColor: 'hsl(217 91% 60% / 0.15)',
          color: 'hsl(217 91% 50%)',
          borderColor: 'hsl(217 91% 60% / 0.3)',
        };
      case 'destructive':
        return {
          backgroundColor: 'var(--color-destructive)',
          color: 'var(--color-destructive-foreground)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-secondary-foreground)',
        };
      case 'outline':
        return {
          borderColor: 'var(--color-border)',
        };
      default:
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
        };
    }
  };

  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={{ ...getVariantStyles(), ...style }}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
