import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFolderTree } from "@/lib/useFolderTree";
import { ROOT_NODES } from "@/lib/utils";

function TreeNode({ node, depth, selected, onSelect, expanded, children, loading, onToggle }) {
  const isExpanded = expanded[node.path];
  const isSelected = selected === node.display;
  const nodeChildren = children[node.path];

  return (
    <li>
      <div
        className={cn(
          "flex items-center gap-1 py-1 px-2 rounded cursor-pointer select-none text-sm transition-colors",
          "hover:bg-accent",
          isSelected && "bg-primary/15 text-primary"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {/* Expand toggle */}
        <span
          className={cn(
            "w-4 h-4 flex items-center justify-center text-muted-foreground transition-transform duration-150 flex-shrink-0",
            isExpanded && "rotate-90"
          )}
          onClick={(e) => { e.stopPropagation(); onToggle(node.path); }}
        >
          <ChevronRight size={12} />
        </span>

        {/* Folder icon */}
        <span className={cn("flex-shrink-0", isSelected ? "text-primary" : "text-yellow-400")}>
          {isExpanded
            ? <FolderOpen size={15} />
            : <Folder size={15} />
          }
        </span>

        {/* Name */}
        <span className="truncate">{node.name}</span>
      </div>

      {/* Children */}
      {isExpanded && (
        <ul className="list-none m-0 p-0">
          {loading[node.path] ? (
            <li>
              <div
                className="py-1 text-xs text-muted-foreground"
                style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}
              >
                Loading...
              </div>
            </li>
          ) : nodeChildren?.length === 0 ? (
            <li>
              <div
                className="py-1 text-xs text-muted-foreground"
                style={{ paddingLeft: `${(depth + 1) * 16 + 28}px` }}
              >
                Empty folder
              </div>
            </li>
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
                onToggle={onToggle}
              />
            ))
          )}
        </ul>
      )}
    </li>
  );
}

export function FolderTree({ selected, onSelect }) {
  const { expanded, children, loading, toggle } = useFolderTree();

  return (
    <ul className="list-none m-0 p-0 py-1">
      {ROOT_NODES.map(node => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          selected={selected}
          onSelect={(n) => onSelect(n.display)}
          expanded={expanded}
          children={children}
          loading={loading}
          onToggle={toggle}
        />
      ))}
    </ul>
  );
}
