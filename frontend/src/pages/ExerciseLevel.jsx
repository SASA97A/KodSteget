import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function ExerciseLevel() {
  const navigate = useNavigate();
  const { level } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetchWithAuth("/exercises/modules");
        if (response.ok) {
          const modules = await response.json();
          const currentModule = modules.find((m) => m.id === Number(level));
          if (currentModule) {
            setExercises(currentModule.exercises);
          }
        }
      } catch (err) {
        console.error("Kunde inte hämta övningar:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExercises();
  }, [level]);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar övningar...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="exercise-level-main">
        <div className="exercise-level-content">
          <button
            className="exercise-back-button"
            type="button"
            onClick={() => navigate("/exercises")}
          >
            ← Tillbaka till nivåer
          </button>

          <div className="exercise-level-heading">
            <span className="exercise-level-label">Nivå {level}</span>
            <h1>Övningar</h1>
            <p>
              Välj en övning och börja träna. Dina framsteg sparas längs vägen.
            </p>
          </div>

          <div className="exercise-list">
            {exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                type="button"
                className="exercise-list-item"
                onClick={() => navigate(`/exercises/${level}/${exercise.id}`)}
              >
                <div className="exercise-list-number">{index + 1}</div>
                <div className="exercise-list-text">
                  <h2>{exercise.title}</h2>
                  <p>XP: {exercise.xpValue}</p>
                </div>
                <div className="exercise-list-action">
                  <span>Starta</span>
                  <span className="exercise-list-arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default ExerciseLevel;
