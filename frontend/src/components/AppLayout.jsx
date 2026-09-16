import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { fetchWithAuth } from "../services/api";

function AppLayout({ children }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const profileRef = useRef(null);

  // Hämta användardata för Topbar
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetchWithAuth("/auth/profile");
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
        }
      } catch (e) {
        console.error("Kunde inte ladda profil för header:", e);
      }
    }
    loadUser();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileOpen(false);
    navigate("/");
  };

  const displayName = userProfile?.email
    ? userProfile.email.split("@")[0]
    : "Användare";

  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="h-screen flex flex-col font-body-md text-on-surface bg-surface antialiased overflow-hidden">
      {/* TopNavBar (Shared Component) */}
      <header className="bg-surface-container-lowest text-primary border-b border-outline-variant shadow-sm z-30 flex-none">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-full">
          {/* Brand & Product Title */}
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2.5 group active:scale-95 transition-transform duration-150" to="/dashboard">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-2xl" data-icon="terminal">terminal</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">KodSteget</span>
              </div>
            </Link>
          </div>
          
          {/* Actions & Profile Cluster */}
          <div className="flex items-center gap-3">
            {/* User Profile Dropdown Anchor */}
            <div className="relative group" ref={profileRef}>
              <button 
                aria-expanded={profileOpen} 
                className="flex items-center justify-center rounded-full p-0.5 border border-outline-variant/60 hover:ring-2 hover:ring-primary/20 transition-all duration-150 cursor-pointer" 
                onClick={() => setProfileOpen((prev) => !prev)}
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-sm">
                  {initials}
                </div>
              </button>
              
              {/* Dropdown Flyout Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant py-2 transition-all z-50 block">
                  <div className="px-4 py-2 border-b border-outline-variant/60">
                    <p className="font-label-ui text-label-ui font-bold text-on-surface capitalize">{displayName}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{userProfile?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-ui font-label-ui text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer" 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg" data-icon="person">person</span>
                    Min profil
                  </button>
                  <div className="my-1 border-t border-outline-variant/50"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-label-ui font-label-ui text-error hover:bg-error-container/40 transition-colors cursor-pointer" 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg" data-icon="logout">logout</span>
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Workspace Container: SideNavBar + Main Content Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar (Shared Component) */}
        <aside className="w-64 min-h-full flex flex-col justify-start p-4 bg-surface-container-lowest text-primary border-r border-outline-variant shadow-sm z-20 flex-shrink-0 select-none">
          <div className="flex flex-col gap-6">
            <nav aria-label="Huvudmeny" className="flex flex-col gap-1.5">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 active:scale-[0.98] transition-transform duration-150 ${isActive ? 'bg-surface-container text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-xl" data-icon="dashboard">dashboard</span>
                <span className="font-label-ui text-label-ui">Dashboard</span>
              </NavLink>
              <NavLink 
                to="/exercises" 
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 active:scale-[0.98] transition-transform duration-150 ${isActive ? 'bg-surface-container text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-xl" data-icon="extension">extension</span>
                <span className="font-label-ui text-label-ui">Övningar</span>
              </NavLink>
              <NavLink 
                to="/results" 
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 active:scale-[0.98] transition-transform duration-150 ${isActive ? 'bg-surface-container text-primary font-bold' : 'text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-primary'}`}
              >
                <span className="material-symbols-outlined text-xl" data-icon="analytics">analytics</span>
                <span className="font-label-ui text-label-ui">Resultat</span>
              </NavLink>
            </nav>
            <div className="border-t border-outline-variant/60 pt-3 flex flex-col gap-1">
              <Link className="flex items-center gap-3 text-on-surface-variant font-medium hover:bg-surface-container-low hover:text-primary rounded-lg px-4 py-2.5 transition-all duration-150" to="/profile">
                <span className="material-symbols-outlined text-xl" data-icon="settings">settings</span>
                <span className="font-label-ui text-label-ui">Inställningar</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Canvas (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface flex flex-col">
          {children}
        </main>
      </div>

      <footer className="w-full bg-surface-container-low border-t border-outline-variant flex-none z-30">
        <div className="flex justify-center items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <span className="text-on-surface-variant font-label-ui text-label-ui">© 2026 KodSteget</span>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;