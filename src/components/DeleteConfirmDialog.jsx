import { useState, useRef, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog, DialogOverlay, DialogContent,
  DialogHeader, DialogTitle, DialogClose, DialogFooter,
} from "./ui/dialog";

export function DeleteConfirmDialog({ open, onClose, onConfirm, itemName, itemType }) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTyped("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const isMatch = typed === itemName;

  const handleConfirm = () => {
    if (!isMatch) return;
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogOverlay onClick={onClose} />
      <DialogContent className="w-[min(420px,90vw)] max-h-fit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 size={15} />
            Delete {itemType}
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Warning banner */}
          <div className="flex items-start gap-3 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2.5">
            <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive leading-snug">
              This action <strong>cannot be undone</strong>.
              {itemType === "folder" && " This will permanently delete the folder and all its contents."}
            </p>
          </div>

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label htmlFor="deleteConfirm">
              Type <span className="font-mono font-semibold text-foreground">{itemName}</span> to confirm
            </Label>
            <Input
              id="deleteConfirm"
              ref={inputRef}
              value={typed}
              onChange={e => setTyped(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleConfirm()}
              placeholder={itemName}
              className={typed.length > 0 ? (isMatch ? "border-success" : "border-destructive") : ""}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex-1" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button
              size="sm"
              disabled={!isMatch}
              onClick={handleConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-40"
            >
              <Trash2 size={13} />
              Delete {itemType}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
