import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        idle:         "border-border text-muted-foreground",
        downloading:  "border-primary text-primary",
        done:         "border-success text-success",
        error:        "border-destructive text-destructive",
      },
    },
    defaultVariants: { variant: "idle" },
  }
);

export function Badge({ variant, className, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
