import { cn } from "../../lib/utils"; // Correct path to the utils file
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={cn("rounded-lg shadow-md p-4 bg-white", className)}>
      {children}
    </div>
  );
}
