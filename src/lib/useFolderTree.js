import { useState, useCallback } from "react";
import { LISTENER_BASE } from "./utils";

export function useFolderTree() {
  const [expanded, setExpanded]   = useState({});
  const [children, setChildren]   = useState({});
  const [loading, setLoading]     = useState({});

  const toggle = useCallback((nodePath) => {
    const isOpen = expanded[nodePath];
    setExpanded(prev => ({ ...prev, [nodePath]: !isOpen }));

    if (!isOpen && !children[nodePath]) {
      setLoading(prev => ({ ...prev, [nodePath]: true }));
      fetch(`${LISTENER_BASE}/?tree=${encodeURIComponent(nodePath)}`)
        .then(r => r.json())
        .then(data => {
          setChildren(prev => ({ ...prev, [nodePath]: data || [] }));
          setLoading(prev => ({ ...prev, [nodePath]: false }));
        })
        .catch(() => {
          setChildren(prev => ({ ...prev, [nodePath]: [] }));
          setLoading(prev => ({ ...prev, [nodePath]: false }));
        });
    }
  }, [expanded, children]);

  return { expanded, children, loading, toggle };
}
