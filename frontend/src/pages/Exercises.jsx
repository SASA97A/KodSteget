import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";

function Exercises() {
  const navigate = useNavigate();

  const levelProgress = {
    1: 78,
    2: 35,
    3: 0,
    4: 0,
  };

  const unlockRequirement = 70;

  const levels = [
    {
      id: 1,
      title: "Nivå 1",
      description: "Grunderna i programmering",
    },
    {
      id: 2,
      title: "Nivå 2",
      description: "Fortsätt med fler programmeringskoncept",
    },
    {
      id: 3,
      title: "Nivå 3",
      description: "Mer avancerade övningar",
    },
    {
      id: 4,
      title: "Nivå 4",
      description: "Utmanande programmeringsproblem",
    },
  ];

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) {
      return true;
    }

    const previousLevelProgress =
      levelProgress[levelId - 1] ?? 0;

    return previousLevelProgress >= unlockRequirement;
  };

  const handleLevelClick = (levelId) => {
    if (!isLevelUnlocked(levelId)) {
      return;
    }

    navigate(`/exercises/${levelId}`);
  };

  return (
    <AppLayout>
      <main className="exercises-main">
        <div className="exercises-content">
          <div className="exercises-heading">
            <span className="exercises-label">
              Övningar
            </span>

            <h1>Välj nivå</h1>

            <p>
              Träna steg för steg och lås upp nya nivåer
              när du gör framsteg.
            </p>
          </div>

          <div className="exercise-levels-grid">
            {levels.map((level) => {
              const unlocked =
                isLevelUnlocked(level.id);

              const progress =
                levelProgress[level.id] ?? 0;

              return (
                <button
                  key={level.id}
                  type="button"
                  className={`exercise-select-card ${
                    unlocked
                      ? "exercise-select-card-unlocked"
                      : "exercise-select-card-locked"
                  }`}
                  onClick={() =>
                    handleLevelClick(level.id)
                  }
                  disabled={!unlocked}
                >
                  <div className="exercise-select-top">
                    <div className="exercise-select-number">
                      {level.id}
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
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="exercise-select-bottom">
                    {unlocked ? (
                      <>
                        <span>Öppna nivå</span>
                        <span className="exercise-select-arrow">
                          →
                        </span>
                      </>
                    ) : (
                      <span>
                        Klara minst {unlockRequirement}% av
                        föregående nivå
                      </span>
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