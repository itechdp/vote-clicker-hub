import { NavLink } from "react-router-dom";
import { Vote, LayoutDashboard, Users, ClipboardList, X } from "lucide-react";

const NAV_ITEMS = [
  { to: "/",           label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/voters",     label: "Voters",     icon: ClipboardList },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col election-gradient select-none">
      {/* ── Branding ── */}
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <Vote className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-[15px] leading-tight tracking-tight truncate">
            Election Portal
          </p>
          <p className="text-white/40 text-xs mt-0.5">2026 General Election</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-white/40 hover:text-white transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-[0.14em] px-3 mb-3">
          Navigation
        </p>

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Live status card ── */}
      <div className="px-4 pb-5">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-300 text-[11px] font-bold uppercase tracking-widest">
              Live
            </span>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            Polls are currently open.
          </p>
          <p className="text-white/30 text-xs mt-0.5">March 24, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
