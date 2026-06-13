import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Dialog({ open, children }) {
  if (!open) return null;
  return <>{children}</>;
}

export function DialogOverlay({ onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm", className)}
    />
  );
}

export function DialogContent({ className, children }) {
  return (
    <div className={cn(
      "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
      "w-[min(480px,95vw)] max-h-[75vh]",
      "bg-background border border-border rounded-lg shadow-2xl",
      "flex flex-col overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

export function DialogHeader({ className, children }) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }) {
  return <h2 className={cn("text-sm font-semibold", className)}>{children}</h2>;
}

export function DialogClose({ onClick }) {
  return (
    <button onClick={onClick} className="rounded-sm opacity-70 hover:opacity-100 transition-opacity">
      <X size={16} />
    </button>
  );
}

export function DialogFooter({ className, children }) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-3 border-t border-border flex-shrink-0 gap-2", className)}>
      {children}
    </div>
  );
}
