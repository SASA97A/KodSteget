import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center font-body-md">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">autorenew</span>
          <p className="font-headline-sm font-bold text-primary">Laddar övning...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-md">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-30 sticky top-0 w-full px-4 lg:px-6 h-16 flex items-center">
          <Link className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors duration-150 font-label-ui text-label-ui px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low" to={`/exercises/${level}`}>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>← Tillbaka till övningar</span>
          </Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">error_outline</span>
          <h1 className="font-headline-lg font-bold text-on-surface mb-2">Övningen kunde inte hittas</h1>
          <p className="text-on-surface-variant mb-6">Det kan bero på ett nätverksfel eller att övningen inte finns.</p>
          <button type="button" onClick={() => navigate(`/exercises/${level}`)} className="tactile-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-ui font-bold shadow-sm">
            Tillbaka till övningar
          </button>
        </main>
      </div>
    );
  }

  const placedBlocks = solution.filter(Boolean).length;
  const allBlocksPlaced = placedBlocks === exercise.correctOrder.length;
  const progressPercent = Math.round((placedBlocks / exercise.correctOrder.length) * 100);

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

  /* =========================
     STYLING HJJÄLPARE
  ========================= */
  
  const getBlockStyle = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("framåt")) return { bg: "bg-primary-container", text: "text-on-primary", icon: "arrow_forward", tag: "Rörelse", tagBg: "bg-black/20", iconColor: "" };
    if (lower.includes("plocka") || lower.includes("stjärna")) return { bg: "bg-secondary", text: "text-on-secondary", icon: "star", tag: "Åtgärd", tagBg: "bg-black/20", iconColor: "", iconFill: true };
    if (lower.includes("sväng") || lower.includes("höger") || lower.includes("vänster")) return { bg: "bg-surface-tint", text: "text-on-primary", icon: "turn_right", tag: "Vridning", tagBg: "bg-black/20", iconColor: "" };
    if (lower.includes("upprepa")) return { bg: "bg-primary-fixed-dim border border-primary/20", text: "text-on-surface", icon: "replay", tag: "Styrning", tagBg: "bg-primary/10 text-primary", iconColor: "text-primary" };
    
    // Default
    return { bg: "bg-surface-container-high", text: "text-on-surface", icon: "extension", tag: "Kodblock", tagBg: "bg-black/10", iconColor: "text-primary" };
  };

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen flex flex-col antialiased selection:bg-primary selection:text-on-primary">
      {/* TOPBAR */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-30 sticky top-0 w-full px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors duration-150 font-label-ui text-label-ui px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low" to={`/exercises/${level}`}>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>← Tillbaka till övningar</span>
          </Link>
          <div className="h-5 w-px bg-outline-variant hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">KodSteget</span>
            <span class="text-on-surface-variant hidden md:inline">/</span>
            <div className="hidden md:flex flex-col">
              <span className="font-label-ui text-label-ui font-semibold text-on-surface">
                Nivå {level} · Övning {exerciseId}: {exercise.title}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant">
          <span className="font-label-ui text-label-ui font-semibold text-on-surface-variant">Block {placedBlocks} av {exercise.correctOrder.length}</span>
          <div className="w-32 h-2.5 bg-surface-container-highest rounded-full overflow-hidden flex">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="font-label-code-sm text-label-code-sm text-primary font-bold">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150" title="Hjälp & Tips" type="button">
            <span className="material-symbols-outlined text-[20px]">help</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-y-auto">
        
        {/* VÄNSTERPANEL */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-label-code-sm text-label-code-sm font-bold">
                  {currentExerciseIndex !== -1 ? String(currentExerciseIndex + 1).padStart(2, '0') : "01"}
                </span>
                <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Uppdragsmål</h1>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-primary font-label-ui text-label-ui font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Aktiv lektion
              </span>
            </div>
            <p className="text-on-surface font-body-md text-body-md mb-4 leading-relaxed">
              {exercise.description}
            </p>
            <div className="bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/60 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-ui text-label-ui font-semibold">
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                <span>Instruktioner</span>
              </div>
              <p className="text-on-surface-variant font-body-sm text-body-sm pl-6">
                {exercise.instruction}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col"
               onDrop={handleReturnToAvailable}
               onDragOver={handleDragOver}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-outline-variant/80">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">extension</span>
                  Tillgängliga kodblock ({exercise.blocks.length} st)
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Klicka eller dra blocken till lösningen till höger.
                </p>
              </div>
              <span className="font-label-ui text-label-ui text-outline self-start sm:self-auto bg-surface-container px-2 py-0.5 rounded">
                Verktygslåda
              </span>
            </div>

            <div className="flex flex-col gap-3 py-1 min-h-[150px]">
              {shuffledBlocks.map((block) => {
                const isUsed = solution.some((item) => item?.id === block.id);
                const isSelected = selectedBlockId === block.id;
                const style = getBlockStyle(block.text);

                if (isUsed) return null; // Göm använda block från poolen

                return (
                  <div
                    key={block.id}
                    className={`tactile-block group flex items-center justify-between px-3.5 py-2.5 rounded-lg select-none ${style.bg} ${style.text} ${isSelected ? 'ring-2 ring-primary ring-offset-2 scale-[0.98]' : 'cursor-grab active:cursor-grabbing'}`}
                    draggable={!isUsed}
                    onClick={() => handleAvailableBlockClick(block)}
                    onDragStart={(event) => handleDragStart(event, block)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${style.text}/60 font-mono text-xs select-none tracking-tighter text-[16px]`}>⋮⋮</span>
                      <span className={`material-symbols-outlined text-[18px] ${style.iconColor}`} style={style.iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}>{style.icon}</span>
                      <span className="font-label-code-md text-label-code-md font-semibold tracking-tight">{block.text}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-label-ui uppercase tracking-wider px-2 py-0.5 rounded ${style.tagBg}`}>{style.tag}</span>
                      <button className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${style.text === 'text-on-surface' ? 'hover:bg-primary/20 text-primary' : 'hover:bg-white/20'}`} title="Lägg till block i lösning" type="button" onClick={(e) => { e.stopPropagation(); handleAvailableBlockClick(block); }}>
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`mt-5 border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer ${draggedBlockId ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:border-outline text-on-surface-variant bg-surface-container-low'}`}>
              <span className="material-symbols-outlined text-[20px]">move_to_inbox</span>
              <span className="font-label-ui text-label-ui font-medium">Släpp här för att lägga tillbaka block</span>
            </div>
          </div>
        </section>

        {/* HÖGERPANEL */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/70">
              <div className="flex items-center gap-3">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">code_blocks</span>
                  Din lösning
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-code-sm text-label-code-sm font-bold border border-outline-variant/60">
                  Placerade block: {placedBlocks} / {exercise.correctOrder.length}
                </span>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg text-label-ui font-label-ui transition-all duration-150 disabled:opacity-50" title="Rensa alla block" type="button" onClick={resetExercise} disabled={placedBlocks === 0}>
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Återställ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Slots */}
              <div className="md:col-span-12 flex flex-col gap-2.5 min-h-[300px]">
                {solution.map((block, index) => {
                  if (block) {
                    const style = getBlockStyle(block.text);
                    return (
                      <div key={index} className="flex items-center gap-2" onDrop={(event) => handleDrop(event, index)} onDragOver={(event) => { handleDragOver(event); setActiveSlot(index); }} onDragLeave={() => setActiveSlot(null)} onClick={() => handleSlotClick(index)}>
                        <span className="w-6 text-right font-label-code-sm text-label-code-sm text-outline font-semibold">{index + 1}.</span>
                        <div className={`flex-1 tactile-block flex items-center justify-between px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing ${style.bg} ${style.text} ${activeSlot === index ? 'ring-2 ring-primary' : ''}`} draggable onDragStart={(event) => handleDragStart(event, block)} onDragEnd={handleDragEnd}>
                          <div className="flex items-center gap-2.5">
                            <span className={`${style.text}/60 font-mono text-xs select-none tracking-tighter text-[15px]`}>⋮⋮</span>
                            <span className={`material-symbols-outlined text-[18px] ${style.iconColor}`} style={style.iconFill ? { fontVariationSettings: "'FILL' 1" } : {}}>{style.icon}</span>
                            <span className="font-label-code-md text-label-code-md font-semibold">{block.text}</span>
                          </div>
                          <button className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${style.text === 'text-on-surface' ? 'hover:bg-error/10 text-error' : 'hover:bg-white/20 text-white/80 hover:text-white'}`} title="Ta bort block" type="button" onClick={(event) => { event.stopPropagation(); removeBlockById(block.id); }}>
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="flex items-center gap-2" onDrop={(event) => handleDrop(event, index)} onDragOver={(event) => { handleDragOver(event); setActiveSlot(index); }} onDragLeave={() => setActiveSlot(null)} onClick={() => handleSlotClick(index)}>
                        <span className="w-6 text-right font-label-code-sm text-label-code-sm text-outline font-semibold">{index + 1}.</span>
                        <div className={`flex-1 border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer ${activeSlot === index || selectedBlockId ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant/70 hover:border-primary hover:text-primary'} tactile-slot`} style={{ backgroundImage: activeSlot === index || selectedBlockId ? 'radial-gradient(#4f46e5 1.2px, transparent 1.2px)' : 'radial-gradient(#c7c4d8 1.2px, transparent 1.2px)', backgroundSize: '14px 14px' }}>
                          <span className="font-label-code-sm text-label-code-sm font-medium">{selectedBlockId ? 'Klicka för att placera' : '+ Dra nästa block hit (valfritt)'}</span>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>

            </div>
          </div>

          {/* Result Feedback */}
          {message && (
            <div className={`border-2 rounded-xl p-4 sm:p-5 flex items-start gap-4 shadow-sm ${resultStatus === 'success' ? 'bg-surface-container-low border-tertiary-container' : resultStatus === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-error-container/20 border-error-container'}`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow ${resultStatus === 'success' ? 'bg-tertiary text-on-tertiary' : resultStatus === 'warning' ? 'bg-amber-500 text-white' : 'bg-error text-on-error'}`}>
                <span className="material-symbols-outlined text-[24px]">{resultStatus === 'success' ? 'check_circle' : resultStatus === 'warning' ? 'warning' : 'error'}</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className={`font-headline-sm text-headline-sm font-bold ${resultStatus === 'success' ? 'text-tertiary' : resultStatus === 'warning' ? 'text-amber-900' : 'text-error'}`}>
                    {resultStatus === 'success' ? 'Snyggt jobbat!' : resultStatus === 'warning' ? 'Nästan där' : 'Något gick fel'}
                  </h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* ACTION BAR */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-sm relative">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-label-ui text-label-ui font-bold transition-all duration-150 active:scale-95 ${allBlocksPlaced ? 'bg-surface-container-high hover:bg-primary-fixed text-primary border-primary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30 opacity-70 cursor-not-allowed'}`} type="button" onClick={checkAnswer} disabled={!allBlocksPlaced || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
                    <span>Rättar...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">rule</span>
                    <span>Kontrollera svar</span>
                  </>
                )}
              </button>
            </div>
            
            {resultStatus === "success" && (
              <div className="w-full sm:w-auto sm:absolute sm:right-4">
                <button className="tactile-btn w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-tertiary text-on-tertiary font-label-ui text-label-ui font-bold shadow-lg shadow-tertiary/25 hover:shadow-tertiary/40 hover:bg-tertiary-container transition-all duration-150 active:scale-95" type="button" onClick={goToNextExercise}>
                  <span>{hasNextExercise ? "Nästa övning" : "Tillbaka till nivån"}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="flex justify-center items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <span className="text-on-surface-variant font-label-ui text-label-ui">© 2026 KodSteget</span>
        </div>
      </footer>
    </div>
  );
}

export default ExerciseTask;
