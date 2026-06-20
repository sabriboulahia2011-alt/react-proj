import { useState, useCallback } from "react";
import { LISTENER_BASE } from "./utils";

export function useFolderTree() {
  const [expanded, setExpanded] = useState({});
  const [children, setChildren] = useState({});
  const [loading, setLoading]   = useState({});
  const [errors, setErrors]     = useState({});

  const fetchChildren = useCallback((nodePath) => {
    setLoading(prev => ({ ...prev, [nodePath]: true }));
    setErrors(prev => ({ ...prev, [nodePath]: false }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    return fetch(`${LISTENER_BASE}/?tree=${encodeURIComponent(nodePath)}`, {
      signal: controller.signal
    })
      .then(r => {
        clearTimeout(timeout);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setChildren(prev => ({ ...prev, [nodePath]: Array.isArray(data) ? data : [] }));
        setLoading(prev => ({ ...prev, [nodePath]: false }));
      })
      .catch(err => {
        clearTimeout(timeout);
        setChildren(prev => ({ ...prev, [nodePath]: [] }));
        setLoading(prev => ({ ...prev, [nodePath]: false }));
        setErrors(prev => ({ ...prev, [nodePath]: err.name === "AbortError" ? "Timeout" : "Failed" }));
      });
  }, []);

  const toggle = useCallback((nodePath) => {
    const isOpen = expanded[nodePath];
    setExpanded(prev => ({ ...prev, [nodePath]: !isOpen }));
    if (!isOpen && !children[nodePath]) {
      fetchChildren(nodePath);
    }
  }, [expanded, children, fetchChildren]);

  // Force re-fetch (used after create/rename/delete)
  const refresh = useCallback((nodePath) => {
    setChildren(prev => {
      const copy = { ...prev };
      delete copy[nodePath];
      return copy;
    });
    if (expanded[nodePath]) {
      fetchChildren(nodePath);
    }
  }, [expanded, fetchChildren]);

  // ── File / folder operations ──
  const createFolder = useCallback((parentPath, folderName) => {
    const fullPath = parentPath.endsWith("\\") ? parentPath + folderName : parentPath + "\\" + folderName;
    return fetch(`${LISTENER_BASE}/?mkdir=${encodeURIComponent(fullPath)}`)
      .then(r => r.json())
      .then(res => {
        if (res.ok) refresh(parentPath);
        return res;
      });
  }, [refresh]);

  const renameItem = useCallback((itemPath, newName, parentPath) => {
    return fetch(`${LISTENER_BASE}/?rename=${encodeURIComponent(itemPath)}&newname=${encodeURIComponent(newName)}`)
      .then(r => r.json())
      .then(res => {
        if (res.ok) refresh(parentPath);
        return res;
      });
  }, [refresh]);

  const deleteItem = useCallback((itemPath, parentPath) => {
    return fetch(`${LISTENER_BASE}/?delete=${encodeURIComponent(itemPath)}`)
      .then(r => r.json())
      .then(res => {
        if (res.ok) refresh(parentPath);
        return res;
      });
  }, [refresh]);

  const readFile = useCallback((filePath) => {
    return fetch(`${LISTENER_BASE}/?readfile=${encodeURIComponent(filePath)}`)
      .then(r => r.json());
  }, []);

  return {
    expanded, children, loading, errors,
    toggle, refresh,
    createFolder, renameItem, deleteItem, readFile,
  };
}