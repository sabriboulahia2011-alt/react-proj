import { useState, useRef } from "react";
import { Download, FolderOpen, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { FolderDialog } from "./FolderDialog";
import { LogPanel } from "./LogPanel";
import { useDownloadContext } from "@/lib/DownloadContext";

export function DownloadForm() {
  const [clipId, setClipId]         = useState("");
  const [folder, setFolder]         = useState("%USERPROFILE%\\Downloads\\Videos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const clipRef = useRef(null);

  const { status, progress, label, speed, eta, logs, doneMsg, errorMsg, download, clearLogs } =
    useDownloadContext();

  const isDownloading = status === "downloading";

  const handleDownload = () => {
    const id = clipId.trim();
    if (!id) {
      clipRef.current?.focus();
      clipRef.current?.classList.add("ring-1", "ring-destructive");
      setTimeout(() => clipRef.current?.classList.remove("ring-1", "ring-destructive"), 1500);
      return;
    }
    download(id, folder);
  };

  return (
    <div className="space-y-3">

      {/* Clip ID */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="clipId">Clip ID</Label>
          <div className="flex gap-2">
            <Input
              id="clipId"
              ref={clipRef}
              value={clipId}
              onChange={e => setClipId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleDownload()}
              placeholder="e.g. 570893821"
              disabled={isDownloading}
            />
            <Button onClick={handleDownload} disabled={isDownloading} className="shrink-0">
              <Download size={15} />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste the clip ID from the Vimeo player debug info
          </p>
        </div>

        {/* Save to */}
        <div className="space-y-1.5">
          <Label htmlFor="folder">Save to</Label>
          <div className="flex gap-2">
            <Input
              id="folder"
              value={folder}
              onChange={e => setFolder(e.target.value)}
              disabled={isDownloading}
            />
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              disabled={isDownloading}
              className="shrink-0"
            >
              <FolderOpen size={15} />
              Browse
            </Button>
          </div>
        </div>

        {/* Progress */}
        {status !== "idle" && (
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono font-medium text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-xs font-mono text-muted-foreground">
              <span>{speed}</span>
              <span>{eta}</span>
            </div>
          </div>
        )}
      </div>

      {/* Done alert */}
      {status === "done" && (
        <Alert variant="success">
          <CheckCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <AlertTitle>Download complete</AlertTitle>
            <AlertDescription>{doneMsg}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Error alert */}
      {status === "error" && (
        <Alert variant="destructive">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <AlertTitle>Download failed</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Log panel */}
      {status !== "idle" && (
        <LogPanel logs={logs} onClear={clearLogs} />
      )}

      {/* Folder dialog */}
      <FolderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={setFolder}
        currentFolder={folder}
      />
    </div>
  );
}
