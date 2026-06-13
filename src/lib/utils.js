import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const LISTENER_IP   = "192.168.18.11";
export const LISTENER_PORT = 8080;
export const LISTENER_BASE = `http://${LISTENER_IP}:${LISTENER_PORT}`;

export const ROOT_NODES = [
  { name: "Downloads", display: "%USERPROFILE%\\Downloads", path: "%USERPROFILE%\\Downloads" },
  { name: "Desktop",   display: "%USERPROFILE%\\Desktop",   path: "%USERPROFILE%\\Desktop"   },
  { name: "Documents", display: "%USERPROFILE%\\Documents", path: "%USERPROFILE%\\Documents" },
  { name: "Videos",    display: "%USERPROFILE%\\Videos",    path: "%USERPROFILE%\\Videos"    },
  { name: "C:\\",      display: "C:\\",                     path: "C:\\"                     },
];
