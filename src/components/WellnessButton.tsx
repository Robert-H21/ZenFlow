import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface WellnessButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gentle" | "peaceful" | "outline";
  size?: "sm" | "md" | "lg";
}

const WellnessButton = forwardRef<HTMLButtonElement, WellnessButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-primary text-primary-foreground shadow-gentle hover:shadow-peaceful transition-calm hover:scale-105",
      gentle: "bg-secondary text-secondary-foreground shadow-gentle hover:bg-accent transition-calm",
      peaceful: "bg-gradient-peaceful text-foreground shadow-gentle hover:shadow-peaceful transition-calm",
      outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-calm"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "rounded-full font-medium transition-calm",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

WellnessButton.displayName = "WellnessButton";

export { WellnessButton };