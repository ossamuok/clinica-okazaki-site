import { Link, NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth-context";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  const email = session?.user?.email ?? "—";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-white">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/inbox" className="font-semibold text-navy-900">
            Editor · Blog Okazaki
          </Link>
          <nav className="flex items-center gap-1">
            <NavItem to="/inbox" label="Inbox" />
            {/* F5 trará Queue, Published, Settings */}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden md:inline">{email}</span>
            <button
              type="button"
              onClick={signOut}
              className="btn-ghost px-3 py-1.5 text-xs"
              aria-label="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
          isActive
            ? "bg-teal-50 text-teal-700"
            : "text-muted hover:text-ink-900",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}
