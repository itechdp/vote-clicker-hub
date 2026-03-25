import { NavLink } from "react-router-dom";
import { Vote, LayoutDashboard, Users, ClipboardList, X, ChevronLeft, ChevronRight } from "lucide-react";

const NAV = [
  { to: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/voters",     label: "Voters",     icon: ClipboardList },
];

interface SidebarProps {
  onClose?:  () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ onClose, collapsed = false, onToggle }: SidebarProps) => (
  <div
    className={`h-full flex flex-col bg-[#0f172a] select-none overflow-hidden ${collapsed ? "cursor-pointer" : ""}`}
    onClick={collapsed ? onToggle : undefined}
  >

    {/* ── Brand ── */}
    <div
      className={`flex items-center border-b border-white/[0.06] ${
        collapsed ? "justify-center py-[18px] px-2" : "gap-3 px-5 py-[18px]"
      }`}
    >
      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
        <Vote className="w-4 h-4 text-white" />
      </div>

      {!collapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[16px] font-bold tracking-tight truncate leading-snug">
              Election Portal
            </p>
            <p className="text-slate-500 text-[13px] leading-snug mt-0.5">
              2026 General Election
            </p>
          </div>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-slate-600 hover:text-slate-300 transition-colors rounded-md p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>

    {/* ── Navigation ── */}
    <nav className={`flex-1 pt-5 space-y-0.5 overflow-y-auto ${collapsed ? "px-2" : "px-3"}`}>
      {!collapsed && (
        <p className="text-slate-600 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 mb-2.5">
          Main Menu
        </p>
      )}

      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          // Stop propagation so clicking a nav item doesn't also toggle collapse
          onClick={(e) => e.stopPropagation()}
          title={collapsed ? label : undefined}
          className={({ isActive }) =>
            [
              "flex items-center rounded-lg text-[13px] font-medium transition-all duration-150",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
              isActive
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={`w-[17px] h-[17px] shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
              {!collapsed && <span>{label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* ── Status card ── */}
    {!collapsed && (
      <div className="px-3">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.12em]">
              Live
            </span>
          </div>
          <p className="text-slate-300 text-[12px] font-medium leading-snug">
            Polls are currently open
          </p>
          <p className="text-slate-600 text-[11px] mt-0.5">March 24, 2026</p>
        </div>
      </div>
    )}

    {/* ── Collapse / Expand button ── */}
    <div className={`pb-5 pt-3 hidden lg:flex ${collapsed ? "justify-center px-2" : "px-3"}`}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        className={[
          "flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]",
          "text-slate-400 hover:text-slate-100 hover:bg-white/[0.10] transition-all",
          collapsed ? "w-9 h-9" : "w-full h-9 gap-2 text-[12px] font-medium",
        ].join(" ")}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default Sidebar;
