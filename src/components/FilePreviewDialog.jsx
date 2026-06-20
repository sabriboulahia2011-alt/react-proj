import { FileText, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogOverlay, DialogContent,
  DialogHeader, DialogTitle, DialogClose,
} from "./ui/dialog";

export function FilePreviewDialog({ open, onClose, fileName, content, tooLarge, loading }) {
  return (
    <Dialog open={open}>
      <DialogOverlay onClick={onClose} />
      <DialogContent className="w-[min(640px,95vw)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 truncate">
            <FileText size={15} className="text-muted-foreground shrink-0" />
            <span className="truncate">{fileName}</span>
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : tooLarge ? (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <AlertTriangle size={16} />
              File is too large to preview (limit 200 KB)
            </div>
          ) : (
            <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground/90">
              {content || "(empty file)"}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
