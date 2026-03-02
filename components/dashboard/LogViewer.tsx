"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Terminal, RefreshCw, Loader2 } from "lucide-react";
interface LogEntry { timestamp: string; level: "info"|"warn"|"error"|"success"; module: string; message: string; }
const STYLES: Record<string,string> = { info:"text-blue-400", warn:"text-yellow-400", error:"text-red-400", success:"text-green-400" };
const PREFIX: Record<string,string> = { info:"INFO ", warn:"WARN ", error:"ERR  ", success:"OK   " };
export default function LogViewer({ guildId }: { guildId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [auto, setAuto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout|null>(null);
  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs/${guildId}`, { cache:"no-store" });
      if (res.ok) { const d = await res.json(); if (Array.isArray(d)) setLogs(d); }
    } catch {}
    setLoading(false);
    setTimeout(() => ref.current?.scrollTo(0, ref.current.scrollHeight), 100);
  }, [guildId]);
  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => {
    if (auto) { timer.current = setInterval(fetch_, 10000); }
    else { if (timer.current) clearInterval(timer.current); }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [auto, fetch_]);
  const fmt = (iso: string) => { try { return new Date(iso).toLocaleTimeString(); } catch { return iso; } };
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Terminal size={22} className="text-green-400"/><h1 className="text-xl font-black text-white">Server Log Summary</h1></div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)} className="accent-green-500"/> Auto-refresh
          </label>
          <button onClick={fetch_} disabled={loading} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
            {loading?<Loader2 size={14} className="animate-spin"/>:<RefreshCw size={14}/>} Refresh
          </button>
        </div>
      </div>
      <div ref={ref} className="rounded-xl overflow-auto h-96 p-4 font-mono text-xs space-y-1" style={{background:"#050505",border:"1px solid rgba(255,255,255,0.06)"}}>
        {loading&&logs.length===0?<div className="flex items-center justify-center h-full text-gray-600"><Loader2 size={20} className="animate-spin mr-2"/>Loading…</div>
          :logs.length===0?<div className="flex items-center justify-center h-full text-gray-600">No data yet</div>
          :logs.map((log,i)=>(
            <div key={i} className="flex gap-3 leading-relaxed">
              <span className="text-gray-600 flex-shrink-0">{fmt(log.timestamp)}</span>
              <span className={`flex-shrink-0 font-bold ${STYLES[log.level]??"text-gray-400"}`}>{PREFIX[log.level]??"LOG  "}</span>
              <span className="text-gray-500 flex-shrink-0">[{log.module}]</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
      </div>
      <p className="text-xs text-gray-600">Shows current configuration state from bot databases. Refreshes every 10s when auto-refresh is on.</p>
    </div>
  );
}
