import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function AppLayout({ children }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    setProfileOpen(false);

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <div className="logo-box">
            KS
          </div>

          <span>KodSteget</span>
        </div>

        <div
          className="profile-menu"
          ref={profileRef}
        >
          <button
            type="button"
            className="profile-button"
            onClick={() =>
              setProfileOpen(
                (previous) => !previous
              )
            }
          >
            <div className="profile-icon">
              <div className="profile-head" />
              <div className="profile-body" />
            </div>

            <span>Profil</span>

            <span
              className={`profile-arrow ${
                profileOpen
                  ? "profile-arrow-open"
                  : ""
              }`}
            >
              ▾
            </span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-info">
                <strong>Inloggad</strong>
                <span>KodSteget</span>
              </div>

              <div className="profile-dropdown-divider" />

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
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
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                ⌂
              </span>

              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/exercises"
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                ◫
              </span>

              <span>Övningar</span>
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                ▤
              </span>

              <span>Resultat</span>
            </NavLink>

            <NavLink
              to="/challenges"
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                ◇
              </span>

              <span>Utmaningar</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="sidebar-icon">
                ⚙
              </span>

              <span>Inställningar</span>
            </NavLink>
          </nav>
        </aside>

        <div className="app-main">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AppLayout;