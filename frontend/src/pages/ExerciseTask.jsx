import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function ExerciseTask() {
  const navigate = useNavigate();
  const { level, exerciseId } = useParams();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const [solution, setSolution] = useState([]);
  const [message, setMessage] = useState("");
  const [resultStatus, setResultStatus] = useState("");
  const [draggedBlockId, setDraggedBlockId] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hämta uppgiften från backend
  useEffect(() => {
    async function loadExercise() {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`/exercises/${exerciseId}`);
        if (res.ok) {
          const data = await res.json();
          setExercise(data);
          setSolution(Array(data.correctOrder.length).fill(null));
        } else {
          setExercise(null);
        }
      } catch (err) {
        console.error("Fel vid laddning av övning:", err);
      } finally {
        setLoading(false);
      }
    }

    loadExercise();
    setMessage("");
    setResultStatus("");
    setDraggedBlockId(null);
    setActiveSlot(null);
    setSelectedBlockId(null);
  }, [exerciseId, level]);

  const shuffledBlocks = useMemo(() => {
    if (!exercise || !exercise.blocks) return [];
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
            <button type="button" onClick={() => navigate("/exercises")}>
              ← Tillbaka till övningar
            </button>
          </div>
        </main>
      </AppLayout>
    );
  }

  const placedBlocks = solution.filter(Boolean).length;
  const allBlocksPlaced = placedBlocks === exercise.correctOrder.length;

  // Drag & Drop och Block-klick
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

  const moveBlockToSlot = (block, targetIndex) => {
    setSolution((previous) => {
      const updated = [...previous];
      const sourceIndex = updated.findIndex((item) => item?.id === block.id);
      const targetBlock = updated[targetIndex];

      if (sourceIndex !== -1) {
        updated[sourceIndex] = targetBlock || null;
        updated[targetIndex] = block;
        return updated;
      }

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
    moveBlockToSlot(JSON.parse(data), targetIndex);
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

  const handleAvailableBlockClick = (block) => {
    if (solution.some((item) => item?.id === block.id)) return;
    setSelectedBlockId((prev) => (prev === block.id ? null : block.id));
  };

  const handleSlotClick = (index) => {
    if (!selectedBlockId) return;
    const block = exercise.blocks.find((item) => item.id === selectedBlockId);
    if (!block) return;
    moveBlockToSlot(block, index);
  };

  const resetExercise = () => {
    setSolution(Array(exercise.correctOrder.length).fill(null));
    setMessage("");
    setResultStatus("");
    setSelectedBlockId(null);
  };

  // Verifiera och skicka in till Backend
  const checkAnswer = async () => {
    if (!allBlocksPlaced) {
      setMessage("Placera alla block innan du kontrollerar svaret.");
      setResultStatus("warning");
      return;
    }

    // Slå ihop blockens text till källkod som skickas in
    const assembledCode = solution.map((b) => b.text).join(" ");

    setIsSubmitting(true);
    try {
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
    } catch (err) {
      setMessage("Kunde inte ansluta till servern för rättning.");
      setResultStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <main className="exercise-task-main">
        <div className="exercise-task-layout">
          <aside
            className={`exercise-task-sidebar ${
              draggedBlockId ? "exercise-sidebar-drop-active" : ""
            }`}
            onDrop={(e) => {
              e.preventDefault();
              const data = e.dataTransfer.getData("application/json");
              if (data) removeBlockById(JSON.parse(data).id);
              setDraggedBlockId(null);
            }}
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

              <div className="available-blocks">
                {shuffledBlocks.map((block, idx) => {
                  const blockKey = block.id || `block-${idx}`;
                  const isUsed = solution.some(
                    (item) => item?.id === (block.id || blockKey),
                  );
                  const isSelected = selectedBlockId === (block.id || blockKey);

                  return (
                    <button
                      key={blockKey}
                      type="button"
                      className={`code-block ${isUsed ? "code-block-used" : ""} ${
                        isSelected ? "code-block-selected" : ""
                      }`}
                      // ... resten av props
                    >
                      <span className="code-block-handle">⋮⋮</span>
                      <span>{block.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

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
                  width: `${(placedBlocks / exercise.correctOrder.length) * 100}%`,
                }}
              />
            </div>

            <div className="solution-area">
              <div className="solution-slots">
                {solution.map((block, index) => (
                  <div
                    key={index}
                    className={`solution-slot ${block ? "solution-slot-filled" : ""} ${
                      activeSlot === index ? "solution-slot-active" : ""
                    }`}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => {
                      handleDragOver(e);
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
                        onDragStart={(e) => handleDragStart(e, block)}
                        onDragEnd={handleDragEnd}
                      >
                        <span className="solution-drag-handle">⋮⋮</span>
                        <span>{block.text}</span>
                        <button
                          type="button"
                          className="solution-remove-button"
                          onClick={(e) => {
                            e.stopPropagation();
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

            <div className="exercise-check-area">
              <button
                type="button"
                className="exercise-check-button"
                onClick={checkAnswer}
                disabled={!allBlocksPlaced || isSubmitting}
              >
                {isSubmitting ? "Rättar..." : "Kontrollera svar"}
              </button>
            </div>
          </section>
        </div>
      </main>
    </AppLayout>
  );
}

export default ExerciseTask;
