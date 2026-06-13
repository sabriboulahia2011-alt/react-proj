import { createContext, useContext } from "react";
import { useDownload } from "./useDownload";

const DownloadContext = createContext(null);

export function DownloadProvider({ children }) {
  const download = useDownload();
  return (
    <DownloadContext.Provider value={download}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownloadContext() {
  return useContext(DownloadContext);
}
