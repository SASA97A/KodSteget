import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profileRes, modulesRes] = await Promise.all([
          fetchWithAuth("/auth/profile"),
          fetchWithAuth("/exercises/modules"),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        if (modulesRes.ok) {
          const modulesData = await modulesRes.json();
          setModules(modulesData);
        }
      } catch (err) {
        console.error("Kunde inte hämta dashboard-data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar dashboard...</div>
      </AppLayout>
    );
  }

  // Identifiera användarens displaynamn (användardelen före @ i mailen)
  const displayName = profile?.email
    ? profile.email.split("@")[0]
    : "Användare";

  // Hitta den aktiva nivån (högsta upplåsta modulen som inte är 100% klar)
  const currentModule =
    modules.filter((m) => m.isUnlocked).slice(-1)[0] || modules[0];

  const currentLevelNumber = currentModule?.orderIndex || 1;
  const currentProgress = currentModule?.progressPercent ?? 0;

  // Hitta nästa modul och räkna krav
  const nextModule = modules.find(
    (m) => m.orderIndex === currentLevelNumber + 1,
  );
  const totalInCurrent = currentModule?.exercises?.length ?? 0;
  const completedInCurrent =
    currentModule?.exercises?.filter((e) => e.isCompleted).length ?? 0;

  const unlockThresholdMet = currentProgress >= 70;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Greeting Banner */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 tactile-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute right-32 -top-12 w-40 h-40 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-2 max-w-2xl relative z-10">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              Hej, {displayName}!
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Välkommen tillbaka. Du har gjort fantastiska framsteg i veckan! Fortsätt bygga dina logiska block för att låsa upp nästa nivå.
            </p>
          </div>
        </section>

        {/* Top Metrics Row: Kort 1 & Kort 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kort 1: Din aktiva nivå */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 tactile-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl" data-icon="flag">flag</span>
                  </span>
                  <div>
                    <span className="font-label-ui text-label-ui text-on-surface-variant uppercase tracking-wider">Aktiv nivå</span>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {currentModule?.title || `Nivå ${currentLevelNumber}`}
                    </h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-label-ui text-label-ui font-bold">
                  <span className="material-symbols-outlined text-sm text-emerald-600" data-icon="check_circle">check_circle</span>
                  {currentProgress}% klart
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Du lär dig grundläggande sekvensering, instruktionsföljd och blockstrukturer. Bara {totalInCurrent - completedInCurrent} övningar kvar i denna sektion!
              </p>
              
              {/* Progression Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant font-medium">
                  <span>Framsteg i modulen</span>
                  <span className="font-label-code-md text-label-code-md text-primary font-bold">{completedInCurrent} av {totalInCurrent} övningar avklarade</span>
                </div>
                <div className="w-full h-3.5 bg-surface-container-high rounded-full overflow-hidden p-0.5 border border-outline-variant/40">
                  <div className="h-full bg-gradient-to-r from-primary-container to-secondary-container rounded-full transition-all duration-500 ease-out" style={{ width: `${currentProgress}%` }}></div>
                </div>
              </div>
            </div>
            {/* Bottom Meta */}
            <div className="pt-4 border-t border-outline-variant/60 flex flex-wrap items-center justify-end gap-4">
              <button onClick={() => navigate(`/exercises/${currentModule?.id}`)} className="text-primary font-label-ui text-label-ui font-semibold inline-flex items-center gap-1 hover:underline">
                Visa alla övningar i {currentModule?.title || "Nivå 1"}
                <span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Kort 2: Vägen till nästa nivå */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 tactile-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <span className="material-symbols-outlined text-2xl" data-icon="lock_open">lock_open</span>
                  </span>
                  <div>
                    <span className="font-label-ui text-label-ui text-on-surface-variant uppercase tracking-wider">Upplåsningskrav</span>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Vägen till {nextModule ? nextModule.title : "Målet"}
                    </h2>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-surface-container text-on-surface-variant text-label-code-sm font-label-code-sm rounded-lg border border-outline-variant/50">
                  {3 - [completedInCurrent > 0, unlockThresholdMet, completedInCurrent === totalInCurrent && totalInCurrent > 0].filter(Boolean).length}/3 krav kvar
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Uppfyll målen nedan för att automatiskt låsa upp <strong className="text-on-surface">{nextModule ? nextModule.title : "nästa mål"}</strong>.
              </p>
              <ul className="space-y-3 mb-4">
                {/* Requirement 1 */}
                <li className={`flex items-start gap-3 p-2.5 rounded-xl border ${completedInCurrent > 0 ? "bg-emerald-50 border-emerald-200/70" : "bg-surface-container-low border-outline-variant/60"}`}>
                  <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${completedInCurrent > 0 ? "text-emerald-600 material-symbols-fill" : "text-outline"}`} data-icon={completedInCurrent > 0 ? "check_circle" : "radio_button_unchecked"}>
                    {completedInCurrent > 0 ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <div className="flex-1">
                    <p className={`font-label-ui text-label-ui ${completedInCurrent > 0 ? "font-bold text-emerald-950" : "font-medium text-on-surface"}`}>Klara minst 1 övning</p>
                    <p className={`font-body-sm text-body-sm ${completedInCurrent > 0 ? "text-emerald-800" : "text-on-surface-variant"}`}>
                      {Math.min(completedInCurrent, 1)} / 1 övning slutförd
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${completedInCurrent > 0 ? "font-bold text-emerald-700 uppercase bg-emerald-200/60" : "font-medium text-on-surface-variant bg-surface-container"}`}>
                    {completedInCurrent > 0 ? "Klar" : "Pågår"}
                  </span>
                </li>
                {/* Requirement 2 */}
                <li className={`flex items-start gap-3 p-2.5 rounded-xl border ${unlockThresholdMet ? "bg-emerald-50 border-emerald-200/70" : "bg-amber-50 border-amber-200/80"}`}>
                  <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${unlockThresholdMet ? "text-emerald-600 material-symbols-fill" : "text-amber-600"}`} data-icon={unlockThresholdMet ? "check_circle" : "radio_button_unchecked"}>
                    {unlockThresholdMet ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <div className="flex-1">
                    <p className={`font-label-ui text-label-ui ${unlockThresholdMet ? "font-bold text-emerald-950" : "font-bold text-amber-950"}`}>Nå 70% framsteg på aktuell nivå</p>
                    <p className={`font-body-sm text-body-sm ${unlockThresholdMet ? "text-emerald-800" : "text-amber-800"}`}>
                      {currentProgress}% av 70%
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${unlockThresholdMet ? "font-bold text-emerald-700 uppercase bg-emerald-200/60" : "font-bold text-amber-700 bg-amber-200/60"}`}>
                    {unlockThresholdMet ? "Klar" : "Pågår"}
                  </span>
                </li>
                {/* Requirement 3 */}
                <li className={`flex items-start gap-3 p-2.5 rounded-xl border ${completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "bg-emerald-50 border-emerald-200/70" : "bg-surface-container-low border-outline-variant/60"}`}>
                  <span className={`material-symbols-outlined text-xl flex-shrink-0 mt-0.5 ${completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "text-emerald-600 material-symbols-fill" : "text-outline"}`} data-icon={completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "check_circle" : "radio_button_unchecked"}>
                    {completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <div className="flex-1">
                    <p className={`font-label-ui text-label-ui ${completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "font-bold text-emerald-950" : "font-medium text-on-surface"}`}>Klara alla övningar i nivån</p>
                    <p className={`font-body-sm text-body-sm ${completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "text-emerald-800" : "text-on-surface-variant"}`}>
                      {completedInCurrent} av {totalInCurrent} godkända övningar
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "font-bold text-emerald-700 uppercase bg-emerald-200/60" : "font-medium text-on-surface-variant bg-surface-container"}`}>
                    {completedInCurrent === totalInCurrent && totalInCurrent > 0 ? "Klar" : `${completedInCurrent}/${totalInCurrent}`}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Kort 3: Dina nivåer Timeline */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 tactile-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-label-ui text-label-ui text-primary uppercase tracking-wider font-bold">Utbildningsväg</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Dina nivåer (Nivåstege)</h2>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-label-ui font-label-ui">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary"></span> Pågående</span>
              <span className="flex items-center gap-1.5 ml-3"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Klar</span>
              <span className="flex items-center gap-1.5 ml-3"><span className="w-3 h-3 rounded-full bg-slate-300"></span> Låst</span>
            </div>
          </div>

          <div className="relative pt-2 pb-4 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[760px] relative">
              {/* Connector Line across columns */}
              <div className="hidden md:block absolute top-7 left-12 right-12 h-1 bg-outline-variant/60 -z-0"></div>

              {modules.map((mod, index) => {
                const isCompleted = mod.progressPercent === 100;
                const isCurrent = mod.id === currentModule?.id;
                const isLocked = !mod.isUnlocked;

                if (isCurrent) {
                  return (
                    <div key={mod.id} className="relative z-10 flex flex-col bg-surface-container-lowest border-2 border-primary rounded-xl p-4 shadow-sm shadow-primary/10 min-h-[260px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold font-label-code-md text-sm ring-4 ring-primary/20">
                          {mod.orderIndex}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-xs font-bold">
                          Aktiv
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface mb-1">{mod.title}</h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mb-3 line-clamp-2">{mod.description || "Sekvenser, algoritmer & blockplacering."}</p>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${mod.progressPercent}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-on-surface-variant font-label-code-sm mb-4">
                        <span>{mod.exercises?.filter(e => e.isCompleted).length || 0}/{mod.exercises?.length || 0} klara</span>
                        <span className="font-bold text-primary">{mod.progressPercent}%</span>
                      </div>
                      <button onClick={() => navigate(`/exercises/${mod.id}`)} className="w-full py-2 px-3 bg-primary-container hover:bg-primary text-on-primary text-center font-label-ui text-label-ui font-semibold rounded-lg tactile-btn-primary">
                        Fortsätt
                      </button>
                    </div>
                  );
                }

                if (isCompleted) {
                  return (
                    <div key={mod.id} className="relative z-10 flex flex-col bg-emerald-50 border border-emerald-200 rounded-xl p-4 min-h-[260px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-label-code-md text-sm ring-4 ring-emerald-100">
                          <span className="material-symbols-outlined text-lg" data-icon="check">check</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
                          Klar
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-sm font-bold text-on-surface mb-1">{mod.title}</h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mb-3 line-clamp-2">{mod.description || "Avklarad nivå."}</p>
                      <div className="mt-auto pt-3 border-t border-emerald-200/60">
                        <button onClick={() => navigate(`/exercises/${mod.id}`)} className="text-emerald-700 font-label-ui text-xs font-bold hover:underline">
                          Repetera övningar
                        </button>
                      </div>
                    </div>
                  );
                }

                // Locked
                return (
                  <div key={mod.id} className={`relative z-10 flex flex-col ${mod.orderIndex === currentLevelNumber + 1 ? 'bg-surface-container-low/60 border-outline-variant opacity-90' : 'bg-surface-container-low/40 border-outline-variant/60 opacity-75'} border rounded-xl p-4 min-h-[260px]`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-full ${mod.orderIndex === currentLevelNumber + 1 ? 'bg-surface-container-high text-on-surface-variant border-outline-variant' : 'bg-surface-container text-outline border-outline-variant/60'} flex items-center justify-center font-bold font-label-code-md text-sm border`}>
                        {mod.orderIndex}
                      </div>
                      <span className="material-symbols-outlined text-outline text-lg" data-icon="lock">lock</span>
                    </div>
                    <h3 className={`font-headline-sm text-sm font-bold ${mod.orderIndex === currentLevelNumber + 1 ? 'text-on-surface' : 'text-on-surface-variant'} mb-1`}>{mod.title}</h3>
                    <p className="font-body-sm text-xs text-on-surface-variant mb-3 line-clamp-2">{mod.description || "Låst nivå."}</p>
                    <div className="mt-auto pt-3 border-t border-outline-variant/40">
                      {mod.orderIndex === currentLevelNumber + 1 ? (
                        <p className="font-label-ui text-xs text-on-surface-variant flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm" data-icon="key">key</span>
                          Låses upp vid 70% på föregående
                        </p>
                      ) : (
                        <span className="text-xs text-outline font-label-ui">Kräver Nivå {mod.orderIndex - 1}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recommended Exercise Card */}
        <section className="w-full">
          <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-7 tactile-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
            <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-md flex-shrink-0 border-b-2 border-black/20">
                <span className="material-symbols-outlined text-3xl" data-icon="extension">extension</span>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-label-code-sm text-label-code-sm font-bold">Rekommenderad</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                  Fortsätt med övningarna i {currentModule?.title || "Nivå 1"}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Gå vidare till nästa övning och bygg vidare på dina kunskaper.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-auto flex-shrink-0 flex items-center justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-variant/40">
              <button onClick={() => navigate(`/exercises/${currentModule?.id}`)} className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-on-primary font-label-ui text-label-ui font-bold rounded-xl tactile-btn-emerald flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
                <span>Starta övning</span>
                <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
