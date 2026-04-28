import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function navClass({ isActive }) {
  return `nav-link${isActive ? " nav-link-active" : ""}`;
}

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Expense Tracker
        </Link>
        <nav className="nav">
          <NavLink to="/" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navClass}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={navClass}>
            Budgets
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            Reports
          </NavLink>
        </nav>
        <div className="user-actions">
          <span className="user-name">{user?.name}</span>
          <button className="danger-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
