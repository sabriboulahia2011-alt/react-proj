import { useState } from "react";
import { Folder, FolderPlus } from "lucide-react";
import { Button } from "./ui/button";
import { FolderTree } from "./FolderTree";
import { NewFolderDialog } from "./NewFolderDialog";
import { useFolderTree } from "@/lib/useFolderTree";
import {
  Dialog, DialogOverlay, DialogContent,
  DialogHeader, DialogTitle, DialogClose, DialogFooter,
} from "./ui/dialog";

export function FolderDialog({ open, onClose, onConfirm, currentFolder }) {
  const [selected, setSelected] = useState(currentFolder);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const { createFolder } = useFolderTree();

  const handleConfirm = () => {
    if (selected) onConfirm(selected);
    onClose();
  };

  // Breadcrumb from display path
  const parts = selected
    ? selected.replace(/\\\\/g, "\\").split("\\").filter(Boolean)
    : [];

  return (
    <Dialog open={open}>
      <DialogOverlay onClick={onClose} />
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Select folder</DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setNewFolderOpen(true)}
              disabled={!selected}
              title="New folder inside selected"
            >
              <FolderPlus size={13} />
              New folder
            </Button>
            <DialogClose onClick={onClose} />
          </div>
        </DialogHeader>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border flex-shrink-0 flex-wrap min-h-[36px] bg-secondary/20">
          {parts.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className={
                i === parts.length - 1
                  ? "text-xs font-mono text-foreground"
                  : "text-xs font-mono text-muted-foreground"
              }>
                {part}
              </span>
              {i < parts.length - 1 && (
                <span className="text-muted-foreground text-xs">›</span>
              )}
            </span>
          ))}
          {parts.length === 0 && (
            <span className="text-xs text-muted-foreground">No folder selected</span>
          )}
        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto">
          <FolderTree selected={selected} onSelect={setSelected} />
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Folder size={14} className="text-yellow-400 flex-shrink-0" />
            <span className="text-xs font-mono text-muted-foreground truncate">
              {selected || "No folder selected"}
            </span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleConfirm} disabled={!selected}>Select</Button>
          </div>
        </DialogFooter>

        <NewFolderDialog
          open={newFolderOpen}
          onClose={() => setNewFolderOpen(false)}
          parentDisplay={selected || ""}
          onConfirm={(name) => selected && createFolder(selected, name)}
        />

      </DialogContent>
    </Dialog>
  );
}