import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileRes, historyRes] = await Promise.all([
          fetchWithAuth("/auth/profile"),
          fetchWithAuth("/submissions/history")
        ]);
        
        if (profileRes.ok) {
          const data = await profileRes.json();
          setUser(data);
        } else {
          setError("Kunde inte hämta profiluppgifter.");
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData);
        }
      } catch (err) {
        console.error("Fel vid laddning av profil:", err);
        setError("Kunde inte ansluta till servern.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">autorenew</span>
          <p className="font-headline-sm font-bold text-primary">Laddar profil...</p>
        </div>
      </AppLayout>
    );
  }

  const displayName = user?.email ? user.email.split("@")[0] : "Användare";
  const initials = displayName.substring(0, 2).toUpperCase();

  const totalSubmissions = history.length;
  const passedCount = history.filter((h) => h.isPassed).length;
  const successRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;

  const handleLogout = () => {
    // Basic logout logic
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
        {/* Sidhuvud */}
        <header className="flex flex-col gap-1">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Min profil</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Hantera dina kontouppgifter och utbildningsframsteg.</p>
        </header>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
          </div>
        )}

        {/* Profilhuvud / Hero-kort (Modern Tactile Bento Hero) */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle algorithmic background accent grid overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-primary-fixed/20 to-transparent pointer-events-none"></div>
          
          {/* Left & Middle: Avatar + Student details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 z-10">
            {/* Vänster: Stor cirkulär avatar med badge */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary text-white flex items-center justify-center font-headline-lg text-headline-lg font-bold shadow-md ring-4 ring-primary-fixed/40 select-none">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#10B981] text-white font-label-ui text-label-ui px-2.5 py-0.5 rounded-full border-2 border-white shadow-sm font-bold tracking-wide">
                Elev
              </span>
            </div>
            
            {/* Mitten: Information */}
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{displayName}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-on-surface-variant font-body-sm text-body-sm">
                <span className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-base text-primary" data-icon="mail">mail</span>
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          
          {/* Höger: Handlingsknappar */}
          <div className="flex items-center gap-3 w-full sm:w-auto z-10">
            <button 
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-surface-container-low text-error border border-outline-variant/60 font-label-ui text-label-ui px-4 py-2.5 rounded-lg font-semibold hover:bg-error-container hover:text-on-error-container transition-all active:scale-[0.98]" 
              type="button"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined text-base" data-icon="logout">logout</span>
              <span>Logga ut</span>
            </button>
          </div>
        </section>

        {/* Prestationskort */}
        <section aria-labelledby="prestationskort-rubrik">
          <h2 className="sr-only" id="prestationskort-rubrik">Prestationer och framsteg</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Kort 1: Nuvarande nivå */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform duration-150 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Nuvarande nivå</span>
                <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined" data-icon="layers">layers</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg font-extrabold text-on-surface">Nivå {user?.currentLevel ?? 1}</span>
                </div>
              </div>
            </div>

            {/* Kort 2: Totalt inskickade lösningar */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform duration-150 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Totalt inskickade</span>
                <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined" data-icon="send">send</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline-lg text-headline-lg font-extrabold text-on-surface">{totalSubmissions}</span>
                  <span className="font-label-code-md text-label-code-md text-on-surface-variant font-bold">st</span>
                </div>
              </div>
            </div>

            {/* Kort 3: Framgångsgrad */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform duration-150 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Framgångsgrad</span>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline-lg text-headline-lg font-extrabold text-emerald-600">{successRate}%</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Kontouppgifter & Inställningar */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col divide-y divide-outline-variant">
          {/* Header för Inställningar */}
          <div className="p-6 bg-surface-container-low/50 flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Kontouppgifter</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Översikt över din profil.</p>
            </div>
            <span className="material-symbols-outlined text-outline" data-icon="person">person</span>
          </div>
          
          {/* Sektion 1: Personuppgifter */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="font-label-ui text-label-ui text-on-surface-variant">Visningsnamn</span>
                <div className="bg-surface-container-low/60 border border-outline-variant/70 rounded-lg px-3.5 py-2.5 font-body-md text-body-md text-on-surface font-semibold flex items-center justify-between">
                  <span>{displayName}</span>
                  <span className="material-symbols-outlined text-sm text-outline" data-icon="badge">badge</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-label-ui text-label-ui text-on-surface-variant">E-postadress</span>
                <div className="bg-surface-container-low/60 border border-outline-variant/70 rounded-lg px-3.5 py-2.5 font-body-md text-body-md text-on-surface font-semibold flex items-center justify-between">
                  <span className="truncate mr-2">{user?.email}</span>
                  <span className="material-symbols-outlined text-sm text-outline" data-icon="mail">mail</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Profile;
