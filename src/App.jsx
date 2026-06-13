import { Badge } from "./components/ui/badge";
import { DownloadForm } from "./components/DownloadForm";
import { DownloadProvider, useDownloadContext } from "./lib/DownloadContext";

function VimeoLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill="#1AB7EA"/>
      <path d="M21 10.5c-.1-2.1-1.5-3.5-3.6-3.5-1.6 0-2.7.8-3.4 2-.7-1.2-1.8-2-3.4-2C8.5 7 7 8.5 7 10.5c0 4.5 7 10.5 7 10.5s7-6 7-10.5z" fill="white"/>
    </svg>
  );
}

function Header() {
  const { status } = useDownloadContext();
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2.5">
        <VimeoLogo />
        <span className="text-base font-semibold tracking-tight">Vimeo Downloader</span>
      </div>
      <Badge variant={status}>{status}</Badge>
    </header>
  );
}

export default function App() {
  return (
    <DownloadProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-10">
          <Header />
          <DownloadForm />
        </div>
      </div>
    </DownloadProvider>
  );
}
