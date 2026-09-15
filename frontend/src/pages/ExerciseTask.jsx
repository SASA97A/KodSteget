import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function ExerciseTask() {
  const navigate = useNavigate();
  const { level, exerciseId } = useParams();

  const [exercise, setExercise] = useState(null);
  const [levelExercises, setLevelExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [solution, setSolution] = useState([]);
  const [message, setMessage] = useState("");
  const [resultStatus, setResultStatus] = useState("");
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Hämta övningsdata och modulens lista över övningar från backend
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [exerciseRes, modulesRes] = await Promise.all([
          fetchWithAuth(`/exercises/${exerciseId}`),
          fetchWithAuth(`/exercises/modules`),
        ]);

        if (exerciseRes.ok) {
          const data = await exerciseRes.json();
          setExercise(data);
          setSolution(Array(data.correctOrder.length).fill(null));
        } else {
          setExercise(null);
        }

        if (modulesRes.ok) {
          const modules = await modulesRes.json();
          const currentModule = modules.find((m) => m.id === Number(level));
          if (currentModule) {
            setLevelExercises(currentModule.exercises);
          }
        }
      } catch (err) {
        console.error("Fel vid laddning av övning:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    setMessage("");
    setResultStatus("");
    setDraggedBlockId(null);
    setActiveSlot(null);
    setSelectedBlockId(null);
  }, [exerciseId, level]);

  // 2. Blanda blocken när övningen ändras
  const shuffledBlocks = useMemo(() => {
    if (!exercise || !exercise.blocks) {
      return [];
    }
    return [...exercise.blocks].sort(() => Math.random() - 0.5);
  }, [exercise]);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar övning...</div>
      </AppLayout>
    );
  }

  if (!exercise) {
    return (
      <AppLayout>
        <main className="exercise-task-main">
          <div style={{ padding: "40px" }}>
            <h1>Övningen kunde inte hittas</h1>
            <button
              type="button"
              onClick={() => navigate(`/exercises/${level}`)}
            >
              ← Tillbaka till övningar
            </button>
          </div>
        </main>
      </AppLayout>
    );
  }

  const placedBlocks = solution.filter(Boolean).length;
  const allBlocksPlaced = placedBlocks === exercise.correctOrder.length;

  /* =========================
     DRAG & DROP
  ========================= */

  const handleDragStart = (event, block) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/json", JSON.stringify(block));
    setDraggedBlockId(block.id);
    setMessage("");
    setResultStatus("");
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setActiveSlot(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  /* =========================
     FLYTTA BLOCK
  ========================= */

  const moveBlockToSlot = (block, targetIndex) => {
    setSolution((previous) => {
      const updated = [...previous];
      const sourceIndex = updated.findIndex((item) => item?.id === block.id);
      const targetBlock = updated[targetIndex];

      // Om blocket redan finns i lösningen byter de plats
      if (sourceIndex !== -1) {
        updated[sourceIndex] = targetBlock || null;
        updated[targetIndex] = block;
        return updated;
      }

      // Block från vänstersidan till en upptagen plats
      if (targetBlock) {
        const emptyIndex = updated.findIndex((item) => item === null);
        if (emptyIndex !== -1) {
          updated[emptyIndex] = targetBlock;
        }
      }

      updated[targetIndex] = block;
      return updated;
    });

    setMessage("");
    setResultStatus("");
    setSelectedBlockId(null);
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const block = JSON.parse(data);
      moveBlockToSlot(block, targetIndex);
    } catch (e) {
      console.error(e);
    }

    setDraggedBlockId(null);
    setActiveSlot(null);
  };

  const removeBlockById = (blockId) => {
    setSolution((previous) =>
      previous.map((item) => (item?.id === blockId ? null : item)),
    );
    setMessage("");
    setResultStatus("");
  };

  const handleReturnToAvailable = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const block = JSON.parse(data);
      removeBlockById(block.id);
    } catch (e) {
      console.error(e);
    }

    setDraggedBlockId(null);
    setActiveSlot(null);
  };

  /* =========================
     KLICKSTÖD
  ========================= */

  const handleAvailableBlockClick = (block) => {
    const alreadyUsed = solution.some((item) => item?.id === block.id);
    if (alreadyUsed) return;

    setSelectedBlockId((previous) => (previous === block.id ? null : block.id));
  };

  const handleSlotClick = (index) => {
    if (!selectedBlockId) return;

    const block = exercise.blocks.find((item) => item.id === selectedBlockId);

    if (!block) return;
    moveBlockToSlot(block, index);
  };

  /* =========================
     ÅTERSTÄLL & KONTROLLERA
  ========================= */

  const resetExercise = () => {
    setSolution(Array(exercise.correctOrder.length).fill(null));
    setMessage("");
    setResultStatus("");
    setSelectedBlockId(null);
    setDraggedBlockId(null);
    setActiveSlot(null);
  };

  const checkAnswer = async () => {
    if (!allBlocksPlaced) {
      setMessage("Placera alla block innan du kontrollerar svaret.");
      setResultStatus("warning");
      return;
    }

    setIsSubmitting(true);

    try {
      // Bygg ihop koden från de placerade blockens text
      const assembledCode = solution.map((b) => b.text).join(" ");

      const response = await fetchWithAuth("/submissions", {
        method: "POST",
        body: JSON.stringify({
          exerciseId: exercise.id,
          code: assembledCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.feedback);
        setResultStatus(result.isPassed ? "success" : "error");
      } else {
        setMessage(result.message || "Ett fel uppstod vid inlämningen.");
        setResultStatus("error");
      }
    } catch {
      setMessage("Kunde inte ansluta till servern för rättning.");
      setResultStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     NAVIGERING TILL NÄSTA
  ========================= */

  const currentExerciseIndex = levelExercises.findIndex(
    (item) => item.id === Number(exerciseId),
  );

  const hasNextExercise =
    currentExerciseIndex !== -1 &&
    currentExerciseIndex < levelExercises.length - 1;

  const goToNextExercise = () => {
    if (!hasNextExercise) {
      navigate(`/exercises/${level}`);
      return;
    }

    const nextExercise = levelExercises[currentExerciseIndex + 1];
    navigate(`/exercises/${level}/${nextExercise.id}`);
  };

  return (
    <AppLayout>
      <main className="exercise-task-main">
        <div className="exercise-task-layout">
          {/* SIDEBAR */}
          <aside
            className={`exercise-task-sidebar ${
              draggedBlockId ? "exercise-sidebar-drop-active" : ""
            }`}
            onDrop={handleReturnToAvailable}
            onDragOver={handleDragOver}
          >
            <button
              className="exercise-task-back"
              type="button"
              onClick={() => navigate(`/exercises/${level}`)}
            >
              ← Tillbaka till övningar
            </button>

            <div className="exercise-task-info">
              <span className="exercise-task-eyebrow">
                Nivå {level} · Övning {exerciseId}
              </span>
              <h2>{exercise.title}</h2>
              <p>{exercise.description}</p>
            </div>

            <div className="exercise-task-divider" />

            <div className="exercise-block-section">
              <div className="exercise-block-heading">
                <h3>Kodblock</h3>
                <span>{exercise.blocks.length} block</span>
              </div>

              <p>{exercise.instruction}</p>

              {selectedBlockId && (
                <div className="block-click-hint">
                  Block valt. Klicka på en plats i lösningen.
                </div>
              )}

              <div
                className="available-blocks"
                onDrop={handleReturnToAvailable}
                onDragOver={handleDragOver}
              >
                {shuffledBlocks.map((block) => {
                  const isUsed = solution.some((item) => item?.id === block.id);
                  const isSelected = selectedBlockId === block.id;

                  return (
                    <button
                      key={block.id}
                      type="button"
                      className={`code-block ${
                        isUsed ? "code-block-used" : ""
                      } ${isSelected ? "code-block-selected" : ""}`}
                      draggable={!isUsed}
                      disabled={isUsed}
                      onClick={() => handleAvailableBlockClick(block)}
                      onDragStart={(event) => handleDragStart(event, block)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="code-block-handle">⋮⋮</span>
                      <span>{block.text}</span>
                    </button>
                  );
                })}
              </div>

              <p className="return-block-hint">
                Dra tillbaka ett block hit för att ta bort det från lösningen.
              </p>
            </div>
          </aside>

          {/* WORKSPACE */}
          <section className="exercise-workspace">
            <div className="exercise-workspace-header">
              <div>
                <span className="exercise-workspace-label">Din lösning</span>
                <h1>Bygg programmet</h1>
                <p>Dra blocken till rätt ordning.</p>
              </div>

              <button
                type="button"
                className="exercise-reset-button"
                onClick={resetExercise}
                disabled={placedBlocks === 0}
              >
                Återställ
              </button>
            </div>

            <div className="exercise-progress-summary">
              <span>Placerade block</span>
              <strong>
                {placedBlocks} / {exercise.correctOrder.length}
              </strong>
            </div>

            <div className="exercise-mini-progress">
              <div
                className="exercise-mini-progress-fill"
                style={{
                  width: `${
                    (placedBlocks / exercise.correctOrder.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* SOLUTION AREA */}
            <div className="solution-area">
              <div className="solution-editor-header">
                <span>Program</span>
                <span>
                  {placedBlocks}/{exercise.correctOrder.length}
                </span>
              </div>

              <div className="solution-slots">
                {solution.map((block, index) => (
                  <div
                    key={index}
                    className={`solution-slot ${
                      block ? "solution-slot-filled" : ""
                    } ${activeSlot === index ? "solution-slot-active" : ""}`}
                    onDrop={(event) => handleDrop(event, index)}
                    onDragOver={(event) => {
                      handleDragOver(event);
                      setActiveSlot(index);
                    }}
                    onDragLeave={() => setActiveSlot(null)}
                    onClick={() => handleSlotClick(index)}
                  >
                    <span className="solution-line-number">{index + 1}</span>

                    {block ? (
                      <div
                        className="solution-block"
                        draggable
                        onDragStart={(event) => handleDragStart(event, block)}
                        onDragEnd={handleDragEnd}
                      >
                        <span className="solution-drag-handle">⋮⋮</span>
                        <span>{block.text}</span>
                        <button
                          type="button"
                          className="solution-remove-button"
                          title="Ta bort block"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeBlockById(block.id);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="solution-placeholder">
                        Dra block hit
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FEEDBACK */}
            {message && (
              <div
                className={`exercise-feedback exercise-feedback-${resultStatus}`}
              >
                <span className="exercise-feedback-icon">
                  {resultStatus === "success"
                    ? "✓"
                    : resultStatus === "error"
                      ? "×"
                      : "!"}
                </span>
                <span>{message}</span>
              </div>
            )}

            {/* ACTIONS */}
            <div className="exercise-check-area">
              <button
                type="button"
                className="exercise-check-button"
                onClick={checkAnswer}
                disabled={!allBlocksPlaced || isSubmitting}
              >
                {isSubmitting ? "Rättar..." : "Kontrollera svar"}
              </button>

              {resultStatus === "success" && (
                <button
                  type="button"
                  className="exercise-next-button"
                  onClick={goToNextExercise}
                >
                  {hasNextExercise ? "Nästa övning →" : "Tillbaka till nivån →"}
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

export default ExerciseTask;
