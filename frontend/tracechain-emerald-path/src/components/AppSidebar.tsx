import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  Building2,
  Route,
  ShieldCheck,
  Box,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/provenance", icon: GitBranch, label: "Provenance Tracer" },
  { to: "/suppliers", icon: Building2, label: "Supplier Registry" },
  { to: "/custody", icon: Route, label: "Chain of Custody" },
  { to: "/quality", icon: ShieldCheck, label: "Quality & Compliance" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center neon-border">
            <Box className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold neon-text tracking-wider">
              TRACECHAIN
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Supply Chain Provenance
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary neon-border"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon
                className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}`}
              />
              <span className="font-display text-xs tracking-wide">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="glass-panel p-3">
          <p className="text-[10px] text-muted-foreground font-display tracking-wider">
            SYSTEM STATUS
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-neon" />
            <span className="text-xs text-primary font-display">ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
