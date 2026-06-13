import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 flex items-start gap-3",
  {
    variants: {
      variant: {
        default:     "bg-background text-foreground border-border",
        destructive: "border-destructive/50 text-destructive bg-destructive/10",
        success:     "border-success/50 text-success bg-success/10",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Alert({ variant, className, children }) {
  return <div className={cn(alertVariants({ variant }), className)}>{children}</div>;
}

export function AlertTitle({ className, children }) {
  return <p className={cn("text-sm font-semibold mb-0.5", className)}>{children}</p>;
}

export function AlertDescription({ className, children }) {
  return <p className={cn("text-xs font-mono opacity-80 break-all", className)}>{children}</p>;
}
