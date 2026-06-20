import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function ContextMenu({ x, y, onClose, items }) {
  return createPortal(
    <>
      <div
        className="fixed inset-0"
        style={{ zIndex: 9998 }}
        onClick={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose(); }}
      />
      <div
        className="fixed min-w-[160px] bg-card border border-border rounded-md shadow-2xl py-1"
        style={{ zIndex: 9999, top: y, left: x }}
      >
        {items.map((item, i) =>
          item.divider ? (
            <div key={i} className="h-px bg-border my-1" />
          ) : (
            <button
              key={i}
              onClick={() => { item.onClick(); onClose(); }}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors",
                "hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed",
                item.danger && "text-destructive hover:text-destructive"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          )
        )}
      </div>
    </>,
    document.body
  );
}