import { useState } from "react";
import { Menu, Vote, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const PAGE_INFO: Record<string, { title: string; sub: string }> = {
  "/":           { title: "Dashboard",  sub: "Real-time election overview & analytics" },
  "/candidates": { title: "Candidates", sub: "Browse candidates and cast your vote" },
  "/voters":     { title: "Voters",     sub: "Complete voter activity log" },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen]           = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const page = PAGE_INFO[pathname] ?? { title: "Election Portal", sub: "" };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 shadow-2xl transition-all duration-300 ease-in-out",
          "lg:static lg:shadow-none lg:shrink-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-[68px]" : "w-64",
        ].join(" ")}
      >
        <Sidebar
          onClose={() => setOpen(false)}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 bg-white border-b border-slate-200 h-14 px-5 lg:px-7 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3.5">
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-[13px]">
              <span className="text-slate-400 font-medium">Election Portal</span>
              <span className="text-slate-300 select-none">/</span>
              <span className="text-slate-800 font-semibold">{page.title}</span>
            </div>

            {/* Mobile title */}
            <div className="lg:hidden flex items-center gap-2">
              <Vote className="w-4 h-4 text-red-600" />
              <span className="text-slate-800 font-semibold text-sm">Election Portal 2026</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
            <button
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;
