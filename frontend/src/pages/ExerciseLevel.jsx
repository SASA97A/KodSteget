import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function ExerciseLevel() {
  const navigate = useNavigate();
  const { level } = useParams();
  const [exercises, setExercises] = useState([]);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetchWithAuth("/exercises/modules");
        if (response.ok) {
          const modules = await response.json();
          const currentModule = modules.find((m) => m.id === Number(level));
          if (currentModule) {
            setModule(currentModule);
            setExercises(currentModule.exercises || []);
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

  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(e => e.isCompleted).length;
  const progressPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  const currentExerciseId = exercises.find(e => !e.isCompleted)?.id;

  const filteredExercises = exercises.filter(ex => {
    if (filter === "completed") return ex.isCompleted;
    if (filter === "pending") return !ex.isCompleted;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Back Link */}
        <nav aria-label="Brödsmulor">
          <Link
            to="/exercises"
            className="inline-flex items-center gap-2 font-label-ui text-label-ui font-semibold text-primary hover:text-on-primary-fixed-variant group transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">
              arrow_back
            </span>
            <span>Tillbaka till alla nivåer</span>
          </Link>
        </nav>

        {/* Level Header & Progress Summary Card */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Title & Overview */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-7 rounded-2xl border border-outline-variant/70 tactile-bevel-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-ui text-label-ui font-bold">
                  <span className="material-symbols-outlined text-[16px] text-primary" data-icon="layers">layers</span>
                  Nivå {module?.orderIndex || level}: {module?.title || `Nivå ${level}`}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                  Aktiv nivå
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-2.5">
                Övningar
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {module?.description || "Lär roboten att navigera, svänga och interagera med miljön genom att placera rätt block i följd."}
              </p>
            </div>
            {/* Block Concept Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-5 mt-4 border-t border-surface-container">
              <span className="text-xs font-semibold text-on-surface-variant">Koncept:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#4F46E5] font-label-code-sm text-label-code-sm font-semibold border border-[#C7D2FE]">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span> gå_framåt()
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF2FF] text-[#4F46E5] font-label-code-sm text-label-code-sm font-semibold border border-[#C7D2FE]">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span> sväng_höger()
              </span>
            </div>
          </div>

          {/* Right: Level Progress Summary Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container p-6 rounded-2xl border border-outline-variant/70 tactile-bevel-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Nivåframsteg</span>
                <span className="px-2.5 py-1 bg-surface-container-highest text-primary font-label-ui text-label-ui font-bold rounded-lg">
                  {progressPercent}% Slutfört
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Status</span>
                  <span className="font-label-ui text-label-ui font-bold text-on-surface">{completedExercises} av {totalExercises} övningar klara ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-outline-variant/30 h-3 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-tertiary-container via-primary-container to-secondary-container h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant pt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary-container" data-icon="verified">verified</span>
                Godkänd för nästa delsteg
              </span>
              <span className="font-semibold text-primary">Nivå {module?.orderIndex ? module.orderIndex + 1 : 2} låses upp vid {totalExercises}/{totalExercises}</span>
            </div>
          </div>
        </section>

        {/* Filter / Tabs Bar Section */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-outline-variant/50">
          <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/60" role="tablist">
            <button
              onClick={() => setFilter("all")}
              aria-selected={filter === "all"}
              className={`px-4 py-2 rounded-lg font-label-ui text-label-ui transition-all ${filter === "all" ? "bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/50" : "text-on-surface-variant hover:text-on-surface font-medium border border-transparent"}`}
              role="tab"
              type="button"
            >
              Alla ({totalExercises})
            </button>
            <button
              onClick={() => setFilter("completed")}
              aria-selected={filter === "completed"}
              className={`px-4 py-2 rounded-lg font-label-ui text-label-ui transition-all ${filter === "completed" ? "bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/50" : "text-on-surface-variant hover:text-on-surface font-medium border border-transparent"}`}
              role="tab"
              type="button"
            >
              Avklarade ({completedExercises})
            </button>
            <button
              onClick={() => setFilter("pending")}
              aria-selected={filter === "pending"}
              className={`px-4 py-2 rounded-lg font-label-ui text-label-ui transition-all ${filter === "pending" ? "bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/50" : "text-on-surface-variant hover:text-on-surface font-medium border border-transparent"}`}
              role="tab"
              type="button"
            >
              Kvar att göra ({totalExercises - completedExercises})
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]" data-icon="swap_vert">swap_vert</span>
            <span>Ordning: Kronologisk lektionssekvens</span>
          </div>
        </section>

        {/* Vertical List of Exercises */}
        <section aria-label={`Övningar i nivå ${level}`} className="flex flex-col gap-3.5">
          {filteredExercises.map((exercise) => {
            const index = exercises.findIndex((e) => e.id === exercise.id);
            const isCompleted = exercise.isCompleted;
            const isCurrent = exercise.id === currentExerciseId;
            const isFinal = index === totalExercises - 1;

            if (isFinal) {
              return (
                <article key={exercise.id} className="relative bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest border-2 border-dashed border-primary-fixed-dim rounded-2xl p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[22px]" data-icon="emoji_events" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{index + 1}. {exercise.title}</h2>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-tertiary-container font-label-ui text-label-ui text-xs font-bold border border-[#A7F3D0]">Klar</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-label-ui text-label-ui text-xs font-bold">Slututmaning</span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{exercise.description || "Kombinera alla inlärda block i en sammanhängande bana."}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-surface-container">
                    <button onClick={() => navigate(`/exercises/${level}/${exercise.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-label-ui text-label-ui font-bold transition-all shadow-sm">
                      <span>{isCompleted ? "Öva igen" : "Starta"}</span>
                      <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            }

            if (isCurrent) {
              return (
                <article key={exercise.id} className="relative bg-surface-container-lowest border-2 border-primary-container rounded-2xl p-5 md:px-7 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-primary/10 -translate-y-0.5 ring-4 ring-primary-fixed/40">
                  <div className="absolute -left-1 top-4 bottom-4 w-2 bg-primary-container rounded-r-md"></div>
                  <div className="flex items-start md:items-center gap-4 pl-1">
                    <div className="relative w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30">
                      <span className="material-symbols-outlined text-[24px]" data-icon="play_arrow">play_arrow</span>
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
                      </span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold">{index + 1}. {exercise.title}</h2>
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary-fixed text-primary font-label-ui text-label-ui font-extrabold">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          Aktuell övning
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant font-medium">{exercise.description || "Hitta vägen genom väggarna med optimal kodsekvens."}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                    <button onClick={() => navigate(`/exercises/${level}/${exercise.id}`)} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-ui text-label-ui font-extrabold text-base tactile-bevel-primary transition-all">
                      <span>Starta övning</span>
                      <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            }

            if (isCompleted) {
              return (
                <article key={exercise.id} className="group bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/60 rounded-2xl p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#ECFDF5] text-tertiary-container flex items-center justify-center border border-[#A7F3D0] flex-shrink-0">
                      <span className="material-symbols-outlined text-[24px] font-bold" data-icon="check">check</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">{index + 1}. {exercise.title}</h2>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-tertiary-container font-label-ui text-label-ui font-bold text-xs border border-[#A7F3D0]">
                          Klar
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{exercise.description || "Övning slutförd."}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-surface-container">
                    <button onClick={() => navigate(`/exercises/${level}/${exercise.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-label-ui text-label-ui font-bold transition-all">
                      <span>Öva igen</span>
                      <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            }

            // Not started
            return (
              <article key={exercise.id} className="bg-surface-container-lowest hover:bg-surface-bright border border-outline-variant/60 rounded-2xl p-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5 opacity-90 hover:opacity-100">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-bold text-base font-label-code-md flex-shrink-0 border border-outline-variant/60">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{index + 1}. {exercise.title}</h2>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-ui text-label-ui text-xs">
                        Ej påbörjad
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{exercise.description || "Låst upp och redo."}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-surface-container">
                  <button onClick={() => navigate(`/exercises/${level}/${exercise.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-ui text-label-ui font-semibold transition-all">
                    <span>Starta</span>
                    <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {/* Pedagogical Tip Box */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[22px]" data-icon="lightbulb">lightbulb</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base mb-1">Tips från KodSteget</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Fastnar du på en övning? Kom ihåg att du kan köra din kod steg för steg i simulatorn. Varje felsteg är bara en ledtråd som visar hur algoritmen kan förfinas!
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ExerciseLevel;
