import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog, DialogOverlay, DialogContent,
  DialogHeader, DialogTitle, DialogClose, DialogFooter,
} from "./ui/dialog";

export function NewFolderDialog({ open, onClose, onConfirm, parentDisplay }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setName("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogOverlay onClick={onClose} />
      <DialogContent className="w-[min(380px,90vw)] max-h-fit">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        <div className="p-4 space-y-2">
          <Label htmlFor="newFolderName">Folder name</Label>
          <Input
            id="newFolderName"
            ref={inputRef}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleConfirm()}
            placeholder="New folder"
          />
          <p className="text-xs text-muted-foreground truncate">
            Inside: {parentDisplay}
          </p>
        </div>

        <DialogFooter>
          <div className="flex-1" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleConfirm} disabled={!name.trim()}>Create</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}