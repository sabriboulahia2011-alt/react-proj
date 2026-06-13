import { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const LOG_COLORS = {
  info:    "text-primary",
  success: "text-success",
  error:   "text-destructive",
  warn:    "text-yellow-400",
  default: "text-muted-foreground",
};

export function LogPanel({ logs, onClear }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log</span>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-6 px-2 text-xs">
          Clear
        </Button>
      </div>
      <div className="h-52 overflow-y-auto p-3 font-mono text-xs leading-relaxed bg-background/50">
        {logs.length === 0 ? (
          <p className="text-muted-foreground">Waiting for download...</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className={cn("block", LOG_COLORS[log.type] || LOG_COLORS.default)}>
              {log.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
