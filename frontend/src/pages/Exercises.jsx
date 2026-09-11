import AppLayout from "../components/AppLayout";

function Exercises() {
  const unlockPercentage = 70;

  const levelProgress = {
    1: 78,
    2: 35,
    3: 0,
    4: 0,
  };

  const levels = [
    {
      id: 1,
      title: "Nivå 1",
      description: "Grunderna i programmering",
      exercises: 8,
    },
    {
      id: 2,
      title: "Nivå 2",
      description: "Variabler, villkor och logik",
      exercises: 10,
    },
    {
      id: 3,
      title: "Nivå 3",
      description: "Loopar och funktioner",
      exercises: 12,
    },
    {
      id: 4,
      title: "Nivå 4",
      description: "Mer avancerade utmaningar",
      exercises: 10,
    },
  ];

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) {
      return true;
    }

    const previousLevel = levelId - 1;

    return levelProgress[previousLevel] >= unlockPercentage;
  };

  return (
    <AppLayout>
      <div className="exercises-main">
        <div className="exercises-content">
          <div className="exercises-heading">
            <h1>Övningar</h1>

            <p>
              Välj en nivå och träna på övningar som passar din utveckling.
            </p>
          </div>

          <div className="level-selection-grid">
            {levels.map((level) => {
              const unlocked = isLevelUnlocked(level.id);
              const progress = levelProgress[level.id];

              return (
                <button
                  key={level.id}
                  className={`exercise-level-card ${
                    !unlocked ? "locked-level" : ""
                  }`}
                  disabled={!unlocked}
                >
                  <div className="exercise-level-top">
                    <div>
                      <span className="exercise-level-number">
                        {level.id}
                      </span>

                      <div>
                        <h2>{level.title}</h2>
                        <p>{level.description}</p>
                      </div>
                    </div>

                    {!unlocked && (
                      <span className="level-lock">🔒</span>
                    )}
                  </div>

                  {unlocked ? (
                    <>
                      <div className="exercise-progress-info">
                        <span>Framsteg</span>
                        <span>{progress}%</span>
                      </div>

                      <div className="exercise-progress-bar">
                        <div
                          className="exercise-progress-fill"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="exercise-level-bottom">
                        <span>{level.exercises} övningar</span>
                        <span className="exercise-open">Öppna →</span>
                      </div>
                    </>
                  ) : (
                    <div className="unlock-message">
                      <strong>Låst nivå</strong>

                      <span>
                        Nå minst {unlockPercentage}% på nivå{" "}
                        {level.id - 1} för att låsa upp.
                      </span>

                      <div className="unlock-progress">
                        {levelProgress[level.id - 1]}% /{" "}
                        {unlockPercentage}%
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Exercises;