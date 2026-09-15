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
      <div className="dashboard-main">
        <div className="dashboard-content">
          <section className="dashboard-heading">
            <h1>Hej, {displayName}!</h1>
            <p>Här ser du din progression och dina nivåer.</p>
          </section>

          {/* KORT 1: AKTUELL NIVÅ */}
          <section className="dashboard-card level-card">
            <span className="card-label">Din aktiva nivå</span>
            <h2>{currentModule?.title || `Nivå ${currentLevelNumber}`}</h2>

            <div className="progress-row">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="progress-percent">{currentProgress}%</span>
            </div>
          </section>

          {/* KORT 2: VÄGEN TILL NÄSTA NIVÅ */}
          <section className="dashboard-card next-level-card">
            <span className="card-label">
              {nextModule
                ? `Vägen till nästa nivå (${nextModule.title})`
                : "Du har nått högsta nivån!"}
            </span>

            <div className="requirement-row">
              <div className="requirement-left">
                <span
                  className={`check-box ${
                    completedInCurrent > 0 ? "checked" : ""
                  }`}
                >
                  {completedInCurrent > 0 ? "✓" : ""}
                </span>
                <span>Klara minst 1 övning</span>
              </div>
              <span>{completedInCurrent > 0 ? "1/1" : "0/1"}</span>
            </div>

            <div className="requirement-row">
              <div className="requirement-left">
                <span
                  className={`check-box ${unlockThresholdMet ? "checked" : ""}`}
                >
                  {unlockThresholdMet ? "✓" : ""}
                </span>
                <span>Nå 70% framsteg på aktuell nivå</span>
              </div>
              <span>{currentProgress}% / 70%</span>
            </div>

            <div className="requirement-row">
              <div className="requirement-left">
                <span
                  className={`check-box ${
                    completedInCurrent === totalInCurrent && totalInCurrent > 0
                      ? "checked"
                      : ""
                  }`}
                >
                  {completedInCurrent === totalInCurrent && totalInCurrent > 0
                    ? "✓"
                    : ""}
                </span>
                <span>Klara alla övningar i nivån</span>
              </div>
              <span>
                {completedInCurrent}/{totalInCurrent}
              </span>
            </div>
          </section>

          {/* KORT 3: ALLA NIVÅER */}
          <section className="dashboard-card levels-card">
            <span className="card-label">Dina nivåer</span>

            <div className="levels">
              {modules.map((mod, index) => {
                const isCompleted = mod.progressPercent === 100;
                const isCurrent = mod.id === currentModule?.id;
                const isLocked = !mod.isUnlocked;

                const statusClass = isCompleted
                  ? "completed"
                  : isCurrent
                    ? "current"
                    : isLocked
                      ? "locked"
                      : "open";

                return (
                  <div
                    key={mod.id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                      className={`level-box ${statusClass}`}
                      style={{ cursor: mod.isUnlocked ? "pointer" : "default" }}
                      onClick={() =>
                        mod.isUnlocked && navigate(`/exercises/${mod.id}`)
                      }
                    >
                      <div className="level-status">
                        {isCompleted ? (
                          "✓"
                        ) : isLocked ? (
                          <span className="lock-icon">▣</span>
                        ) : (
                          mod.orderIndex
                        )}
                      </div>

                      <div>
                        <span>{mod.title}</span>
                        <small>
                          {isCompleted
                            ? "Klar"
                            : isCurrent
                              ? "Aktuell"
                              : isLocked
                                ? "Låst"
                                : `${mod.progressPercent}%`}
                        </small>
                      </div>
                    </div>

                    {index < modules.length - 1 && (
                      <div className="level-line" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
