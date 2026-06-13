import { useState, useCallback } from "react";
import { LISTENER_BASE } from "./utils";

export function useDownload() {
  const [status, setStatus]     = useState("idle"); // idle | downloading | done | error
  const [progress, setProgress] = useState(0);
  const [label, setLabel]       = useState("");
  const [speed, setSpeed]       = useState("");
  const [eta, setEta]           = useState("");
  const [logs, setLogs]         = useState([]);
  const [doneMsg, setDoneMsg]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const appendLog = (text, type = "default") => {
    setLogs(prev => [...prev, { text, type, id: Date.now() + Math.random() }]);
  };

  const parseLine = useCallback((line) => {
    const pctMatch   = line.match(/(\d+\.?\d*)%/);
    const speedMatch = line.match(/at\s+([\d.]+\s*\w+\/s)/);
    const etaMatch   = line.match(/ETA\s+([\d:]+)/);

    if (pctMatch) {
      const pct = Math.min(100, parseFloat(pctMatch[1]));
      setProgress(pct);
      setSpeed(speedMatch ? speedMatch[1] : "");
      setEta(etaMatch ? "ETA " + etaMatch[1] : "");
      setLabel(
        line.includes("st=video") ? "Downloading video..." :
        line.includes("st=audio") ? "Downloading audio..." :
        "Downloading..."
      );
    }
    if (line.includes("[Merger]") || line.includes("Merging formats")) {
      setProgress(100);
      setLabel("Merging streams...");
      setSpeed(""); setEta("");
    }
    if (line.includes("Deleting original file")) {
      setLabel("Cleaning up...");
    }

    const type =
      line.startsWith("[vimeo]") || line.startsWith("[info]") ? "info" :
      line.includes("100%") || line.includes("Merging") || line.includes("Deleting") ? "success" :
      line.startsWith("ERROR") || line.includes("ERROR:") ? "error" :
      line.startsWith("WARNING") ? "warn" : "default";

    if (line.trim()) appendLog(line, type);
  }, []);

  const download = useCallback((clipId, folder) => {
    setStatus("downloading");
    setProgress(0);
    setLabel("Connecting...");
    setSpeed(""); setEta("");
    setLogs([]);
    setDoneMsg(""); setErrorMsg("");

    appendLog(`Clip ID: ${clipId}`, "info");
    appendLog(`Save to: ${folder}`, "info");

    const url = `${LISTENER_BASE}/?id=${encodeURIComponent(clipId)}&folder=${encodeURIComponent(folder)}`;
    let hasError = false;

    const es = new EventSource(url);

    es.onmessage = (e) => {
      const line = e.data;
      if (line === "__DONE__") {
        es.close();
        if (hasError) {
          setStatus("error");
          setProgress(0);
          setLabel("Failed");
        } else {
          setStatus("done");
          setProgress(100);
          setLabel("Done");
          setDoneMsg(`Saved to ${folder}`);
        }
        return;
      }
      if (line.includes("ERROR")) hasError = true;
      parseLine(line);
    };

    es.onerror = () => {
      es.close();
      if (!hasError) {
        const msg = `Connection lost — make sure listener.ps1 is running on ${LISTENER_BASE}`;
        appendLog(msg, "error");
        setErrorMsg(msg);
        setStatus("error");
        setProgress(0);
        setLabel("Connection failed");
      }
    };
  }, [parseLine]);

  const clearLogs = () => setLogs([]);
  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setLabel("");
    setSpeed(""); setEta("");
    setLogs([]);
    setDoneMsg(""); setErrorMsg("");
  };

  return { status, progress, label, speed, eta, logs, doneMsg, errorMsg, download, clearLogs, reset };
}
