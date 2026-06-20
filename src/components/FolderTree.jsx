import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, File, FolderPlus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFolderTree } from "@/lib/useFolderTree";
import { ROOT_NODES } from "@/lib/utils";
import { ContextMenu } from "./ui/context-menu";
import { NewFolderDialog } from "./NewFolderDialog";
import { FilePreviewDialog } from "./FilePreviewDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog.jsx";

function formatSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function TreeNode({
  node, depth, selected, onSelect,
  expanded, children, loading, errors, onToggle,
  onContextMenu, renamingPath, renameValue, onRenameChange, onRenameSubmit, onRenameCancel,
  onFileClick,
}) {
  const isFolder = node.type !== "file";
  const isExpanded = expanded[node.path];
  const isSelected = selected === node.display;
  const isRenaming = renamingPath === node.path;
  const nodeChildren = children[node.path];

  const handleClick = () => {
    if (isFolder) onSelect(node);
    else onFileClick(node);
  };

  return (
    <li>
      <div
        className={cn(
          "group flex items-center gap-1 py-1 px-2 rounded cursor-pointer select-none text-sm transition-colors",
          "hover:bg-accent",
          isSelected && isFolder && "bg-primary/15 text-primary"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, node); }}
      >
        {/* Expand toggle (folders only) */}
        <span
          className={cn(
            "w-4 h-4 flex items-center justify-center text-muted-foreground transition-transform duration-150 flex-shrink-0",
            isFolder ? (isExpanded && "rotate-90") : "invisible"
          )}
          onClick={(e) => { if (isFolder) { e.stopPropagation(); onToggle(node.path); } }}
        >
          {isFolder && <ChevronRight size={12} />}
        </span>

        {/* Icon */}
        <span className={cn("flex-shrink-0", isFolder ? (isSelected ? "text-primary" : "text-yellow-400") : "text-muted-foreground")}>
          {isFolder
            ? (isExpanded ? <FolderOpen size={15} /> : <Folder size={15} />)
            : <File size={15} />
          }
        </span>

        {/* Name or rename input */}
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === "Enter") onRenameSubmit();
              if (e.key === "Escape") onRenameCancel();
            }}
            onBlur={onRenameSubmit}
            className="flex-1 bg-input border border-primary rounded px-1 text-sm outline-none"
          />
        ) : (
          <span className="truncate flex-1">{node.name}</span>
        )}

        {!isFolder && node.size != null && (
          <span className="text-xs text-muted-foreground font-mono shrink-0">{formatSize(node.size)}</span>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && (
        <ul className="list-none m-0 p-0">
          {loading[node.path] ? (
            <li><div className="py-1 text-xs text-muted-foreground" style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}>Loading...</div></li>
          ) : errors[node.path] ? (
            <li><div className="py-1 text-xs text-destructive" style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}>❌ {errors[node.path]}</div></li>
          ) : nodeChildren?.length === 0 ? (
            <li><div className="py-1 text-xs text-muted-foreground" style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}>Empty folder</div></li>
          ) : (
            nodeChildren?.map(child => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selected={selected}
                onSelect={onSelect}
                expanded={expanded}
                children={children}
                loading={loading}
                errors={errors}
                onToggle={onToggle}
                onContextMenu={onContextMenu}
                renamingPath={renamingPath}
                renameValue={renameValue}
                onRenameChange={onRenameChange}
                onRenameSubmit={onRenameSubmit}
                onRenameCancel={onRenameCancel}
                onFileClick={onFileClick}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}

export function FolderTree({ selected, onSelect }) {
  const {
    expanded, children, loading, errors, toggle, refresh,
    createFolder, renameItem, deleteItem, readFile,
  } = useFolderTree();

  const [menu, setMenu] = useState(null); // { x, y, node, parentPath }
  const [renamingPath, setRenamingPath] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolderTarget, setNewFolderTarget] = useState(null); // { path, display }
  const [preview, setPreview] = useState(null); // { name, content, tooLarge, loading }
  const [deleteTarget, setDeleteTarget] = useState(null); // { node, parentPath }

  // Find parent path of a node by walking the tree we already have loaded
  const findParentPath = (targetPath) => {
    for (const parentPath of Object.keys(children)) {
      if (children[parentPath]?.some(c => c.path === targetPath)) return parentPath;
    }
    // root-level node
    const root = ROOT_NODES.find(r => r.path === targetPath);
    return root ? null : null;
  };

  const handleContextMenu = (e, node) => {
    const parentPath = findParentPath(node.path);
    setMenu({ x: e.clientX, y: e.clientY, node, parentPath });
  };

  const handleRootContextMenu = (e, node) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, node, parentPath: null, isRoot: true });
  };

  const startRename = (node) => {
    setRenamingPath(node.path);
    setRenameValue(node.name);
  };

  const submitRename = () => {
    if (!renamingPath) return;
    const node = menu?.node;
    const trimmed = renameValue.trim();
    const parentPath = findParentPath(renamingPath);
    if (trimmed && node && trimmed !== node.name) {
      renameItem(renamingPath, trimmed, parentPath || "");
    }
    setRenamingPath(null);
  };

  const cancelRename = () => setRenamingPath(null);

  const handleDelete = (node) => {
    const parentPath = findParentPath(node.path);
    setDeleteTarget({ node, parentPath });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteItem(deleteTarget.node.path, deleteTarget.parentPath || "");
    setDeleteTarget(null);
  };

  const handleFileClick = (node) => {
    setPreview({ name: node.name, content: "", tooLarge: false, loading: true });
    readFile(node.path).then(res => {
      setPreview({
        name: node.name,
        content: res.content || "",
        tooLarge: !!res.tooLarge,
        loading: false,
      });
    });
  };

  const buildMenuItems = () => {
    if (!menu) return [];
    const { node, parentPath, isRoot } = menu;
    if (isRoot) {
      return [
        { label: "New folder", icon: <FolderPlus size={14} />, onClick: () => setNewFolderTarget({ path: node.path, display: node.display }) },
      ];
    }
    const items = [];
    if (node.type !== "file") {
      items.push({ label: "New folder", icon: <FolderPlus size={14} />, onClick: () => setNewFolderTarget({ path: node.path, display: node.display }) });
      items.push({ divider: true });
    }
    items.push({ label: "Rename", icon: <Pencil size={14} />, onClick: () => startRename(node) });
    items.push({ label: "Delete", icon: <Trash2 size={14} />, danger: true, onClick: () => handleDelete(node) });
    return items;
  };

  return (
    <>
      <ul className="list-none m-0 p-0 py-1">
        {ROOT_NODES.map(node => (
          <div key={node.path} onContextMenu={(e) => handleRootContextMenu(e, node)}>
            <TreeNode
              node={node}
              depth={0}
              selected={selected}
              onSelect={(n) => onSelect(n.display)}
              expanded={expanded}
              children={children}
              loading={loading}
              errors={errors}
              onToggle={toggle}
              onContextMenu={handleContextMenu}
              renamingPath={renamingPath}
              renameValue={renameValue}
              onRenameChange={setRenameValue}
              onRenameSubmit={submitRename}
              onRenameCancel={cancelRename}
              onFileClick={handleFileClick}
            />
          </div>
        ))}
      </ul>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onClose={() => setMenu(null)}
          items={buildMenuItems()}
        />
      )}

      <NewFolderDialog
        open={!!newFolderTarget}
        onClose={() => setNewFolderTarget(null)}
        parentDisplay={newFolderTarget?.display || ""}
        onConfirm={(name) => createFolder(newFolderTarget.path, name)}
      />

      <FilePreviewDialog
        open={!!preview}
        onClose={() => setPreview(null)}
        fileName={preview?.name}
        content={preview?.content}
        tooLarge={preview?.tooLarge}
        loading={preview?.loading}
      />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.node?.name || ""}
        itemType={deleteTarget?.node?.type === "file" ? "file" : "folder"}
      />
    </>
  );
}
