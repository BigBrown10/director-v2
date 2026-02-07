import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider relative overflow-hidden group",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:shadow-[0_0_15px_rgba(0,243,255,0.7)] border-2 border-transparent hover:border-primary/50",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_rgba(255,51,51,0.7)]",
                outline:
                    "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(0,243,255,0.4)]",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_15px_rgba(255,0,255,0.7)]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                neon: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_var(--primary)] text-shadow",
            },
            size: {
                default: "h-12 px-6 py-2 skew-x-[-10deg]", // Cyberpunk skew
                sm: "h-9 rounded-md px-3 text-xs skew-x-[-10deg]",
                lg: "h-14 rounded-md px-8 skew-x-[-10deg]",
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
    ({ className, variant, size, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                <span className="inline-block transform skew-x-[10deg]">{children}</span>
                {/* Counter-skew the text */}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
