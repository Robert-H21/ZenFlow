import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface WellnessCardProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

export const WellnessCard = ({ children, className, animated = false, onClick }: WellnessCardProps) => {
  return (
    <Card 
      className={cn(
        "p-6 shadow-gentle hover:shadow-peaceful transition-calm border-border/50 bg-card/80 backdrop-blur-sm",
        animated && "hover:scale-105 animate-float",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};