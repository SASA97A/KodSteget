import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AppLayout({ children }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    setProfileOpen(false);

    // Här kan vi senare även ta bort token/session
    // localStorage.removeItem("token");

    navigate("/register");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <div className="logo-box"></div>
          <span>KodSteget</span>
        </div>

        <div className="profile-menu" ref={profileRef}>
          <button
            className="profile-button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="profile-icon">
              <span className="profile-head"></span>
              <span className="profile-body"></span>
            </span>

            <span>Profil</span>

            <span
              className={`profile-arrow ${
                profileOpen ? "profile-arrow-open" : ""
              }`}
            >
              ↓
            </span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown" role="menu">
              <div className="profile-dropdown-info">
                <strong>Elin</strong>
                <span>Mitt konto</span>
              </div>

              <div className="profile-dropdown-divider"></div>

              <button
                className="logout-button"
                onClick={handleLogout}
                role="menuitem"
              >
                Logga ut
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <span className="sidebar-icon">⌂</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/exercises"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <span className="sidebar-icon">⌑</span>
              Övningar
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <span className="sidebar-icon">▥</span>
              Resultat
            </NavLink>

            <NavLink
              to="/challenges"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <span className="sidebar-icon">♜</span>
              Utmaningar
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <span className="sidebar-icon">⚙</span>
              Inställningar
            </NavLink>
          </nav>
        </aside>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;