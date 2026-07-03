import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Code2,
  Home,
  List,
  LogIn,
  LogOut,
  Menu,
  Trophy,
  User,
  UserPlus,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="navbar">
      <Link className="brand" to="/" onClick={closeMobile}>
        <Code2 className="brand-icon" size={22} strokeWidth={2.25} />
        Online Judge
      </Link>

      <button
        className="mobile-nav-toggle"
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav
        className={`nav-links${mobileOpen ? " open" : ""}`}
        aria-label="Primary navigation"
      >
        <NavLink to="/" end onClick={closeMobile}>
          <Home size={16} />
          Home
        </NavLink>
        <NavLink to="/problems" onClick={closeMobile}>
          <List size={16} />
          Problems
        </NavLink>
        <NavLink to="/leaderboard" onClick={closeMobile}>
          <Trophy size={16} />
          Leaderboard
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/profile" onClick={closeMobile}>
              <User size={16} />
              {user?.name || "Profile"}
            </NavLink>
            <button className="link-button" type="button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMobile}>
              <LogIn size={16} />
              Login
            </NavLink>
            <NavLink to="/register" onClick={closeMobile}>
              <UserPlus size={16} />
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
