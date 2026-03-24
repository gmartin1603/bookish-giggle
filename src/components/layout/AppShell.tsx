import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { ThemeToggle } from "../ui/ThemeToggle";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/reports/new", label: "New Report" },
  { to: "/settings", label: "Settings" }
];

function getPageMeta(pathname: string) {
  if (pathname === "/") {
    return {
      title: "Dashboard",
      detail: "Recent reports and quick actions"
    };
  }

  if (pathname === "/reports/new") {
    return {
      title: "New Report",
      detail: "Build a new farm report"
    };
  }

  if (pathname.startsWith("/reports/") && pathname.endsWith("/edit")) {
    return {
      title: "Edit Report",
      detail: "Review, adjust, and save changes"
    };
  }

  if (pathname === "/settings") {
    return {
      title: "Settings",
      detail: "Labels, categories, and units"
    };
  }

  return {
    title: "Farm Report",
    detail: "Field-ready reporting"
  };
}

export function AppShell() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pageMeta = getPageMeta(location.pathname);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="app-shell">
      <button
        className={`sidebar-overlay${isSidebarOpen ? " sidebar-overlay-visible" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        id="app-sidebar"
        className={`app-sidebar${isSidebarOpen ? " app-sidebar-open" : ""}`}
      >
        <div className="brand-block">
          <div className="brand-lockup">
            <img
              className="brand-logo"
              src="/farm-report-icon.svg"
              alt="Farm Report logo"
              width="72"
              height="72"
            />
            <div className="brand-copy">
              <p className="eyebrow">Farm Report</p>
              <h1>Operations Ledger</h1>
            </div>
          </div>
          <p className="muted-copy">Preserved Firestore schema, rebuilt experience.</p>
        </div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <ThemeToggle />
          <p className="user-chip">{user?.email ?? "Signed in"}</p>
          <button className="button button-ghost" onClick={() => void signOut()}>
            Logout
          </button>
        </div>
      </aside>
      <main className="app-main">
        <div className="app-main-header">
          <button
            className="sidebar-toggle sidebar-toggle-inline"
            type="button"
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            <span className="sidebar-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Menu
          </button>
          <div className="app-main-heading">
            <p className="eyebrow">{pageMeta.title}</p>
            <h2>{pageMeta.detail}</h2>
          </div>
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
