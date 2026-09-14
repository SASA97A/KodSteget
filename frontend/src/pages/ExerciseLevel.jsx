import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function ExerciseLevel() {
  const navigate = useNavigate();
  const { level } = useParams();

  const exercises = [
    {
      id: 1,
      title: "Din första variabel",
      description: "Skapa en variabel och ge den ett värde.",
    },
    {
      id: 2,
      title: "Arbeta med text",
      description: "Skapa och använd en textsträng.",
    },
    {
      id: 3,
      title: "Enkel beräkning",
      description: "Använd variabler för att göra en beräkning.",
    },
    {
      id: 4,
      title: "Villkor",
      description: "Träna på att använda if-satser.",
    },
    {
      id: 5,
      title: "Kombinera det du lärt dig",
      description: "Lös en uppgift med flera av momenten.",
    },
  ];

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
            <span className="exercise-level-label">
              Nivå {level}
            </span>

            <h1>Övningar</h1>

            <p>
              Välj en övning och börja träna. Dina framsteg
              sparas längs vägen.
            </p>
          </div>

          <div className="exercise-list">
            {exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                type="button"
                className="exercise-list-item"
                onClick={() =>
                  navigate(
                    `/exercises/${level}/${exercise.id}`
                  )
                }
              >
                <div className="exercise-list-number">
                  {index + 1}
                </div>

                <div className="exercise-list-text">
                  <h2>{exercise.title}</h2>
                  <p>{exercise.description}</p>
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