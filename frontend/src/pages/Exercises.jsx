import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function Exercises() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModules() {
      try {
        const response = await fetchWithAuth("/exercises/modules");
        if (response.ok) {
          const data = await response.json();
          setLevels(data);
        }
      } catch (err) {
        console.error("Kunde inte hämta moduler:", err);
      } finally {
        setLoading(false);
      }
    }

    loadModules();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar nivåer...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="exercises-main">
        <div className="exercises-content">
          <div className="exercises-heading">
            <span className="exercises-label">Övningar</span>
            <h1>Välj nivå</h1>
            <p>
              Träna steg för steg och lås upp nya nivåer när du gör framsteg.
            </p>
          </div>

          <div className="exercise-levels-grid">
            {levels.map((level) => {
              const unlocked = level.isUnlocked;
              const progress = level.progressPercent;

              return (
                <button
                  key={level.id}
                  type="button"
                  className={`exercise-select-card ${
                    unlocked
                      ? "exercise-select-card-unlocked"
                      : "exercise-select-card-locked"
                  }`}
                  onClick={() => unlocked && navigate(`/exercises/${level.id}`)}
                  disabled={!unlocked}
                >
                  <div className="exercise-select-top">
                    <div className="exercise-select-number">
                      {level.orderIndex || level.id}
                    </div>
                    <div
                      className={`exercise-select-status ${
                        unlocked
                          ? "exercise-select-status-open"
                          : "exercise-select-status-locked"
                      }`}
                    >
                      {unlocked ? "Öppen" : "Låst"}
                    </div>
                  </div>

                  <div className="exercise-select-content">
                    <h2>{level.title}</h2>
                    <p>{level.description}</p>
                  </div>

                  <div className="exercise-select-progress">
                    <div className="exercise-select-progress-info">
                      <span>Framsteg</span>
                      <strong>{progress}%</strong>
                    </div>

                    <div className="exercise-select-progress-bar">
                      <div
                        className="exercise-select-progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="exercise-select-bottom">
                    {unlocked ? (
                      <>
                        <span>Öppna nivå</span>
                        <span className="exercise-select-arrow">→</span>
                      </>
                    ) : (
                      <span>Klara minst 70% av föregående nivå</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default Exercises;
