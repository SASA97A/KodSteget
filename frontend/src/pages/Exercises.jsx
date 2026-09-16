import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

const CONCEPT_TAGS = {
  1: ["Sekvens", "Flytta fram", "Sväng"],
  2: ["Om / Annars", "Sensorer", "Boolesk logik"],
  3: ["Upprepa X ggr", "While-loop", "Mönster"],
  4: ["Heltal", "Räknare", "Listor"],
  5: ["Definiera funktion", "Parametrar", "Sortering"],
};

const DEFAULT_MODULES = [
  {
    id: 1,
    orderIndex: 1,
    title: "Grunderna i kodblock",
    description: "Sekvenser, körning och enkla kommandon för roboten.",
    isUnlocked: true,
    progressPercent: 60,
    exercises: [
      { id: 1, isCompleted: true },
      { id: 2, isCompleted: true },
      { id: 3, isCompleted: true },
      { id: 4, isCompleted: true },
      { id: 5, isCompleted: true },
      { id: 6, isCompleted: true },
      { id: 7, isCompleted: false },
      { id: 8, isCompleted: false },
      { id: 9, isCompleted: false },
      { id: 10, isCompleted: false },
    ],
  },
  {
    id: 2,
    orderIndex: 2,
    title: "Villkor & Logiska satser",
    description: "Lär dig IF/ELSE, sant/falskt och sensoravläsning.",
    isUnlocked: false,
    progressPercent: 0,
    exercises: Array.from({ length: 12 }, (_, i) => ({ id: 201 + i, isCompleted: false })),
  },
  {
    id: 3,
    orderIndex: 3,
    title: "Loopar & Mönster",
    description: "Effektivisera kod med upprepningar och While-loopar.",
    isUnlocked: false,
    progressPercent: 0,
    exercises: Array.from({ length: 10 }, (_, i) => ({ id: 301 + i, isCompleted: false })),
  },
  {
    id: 4,
    orderIndex: 4,
    title: "Variabler & Datastrukturer",
    description: "Lagra värden, räkna poäng och hantera dynamisk data.",
    isUnlocked: false,
    progressPercent: 0,
    exercises: Array.from({ length: 14 }, (_, i) => ({ id: 401 + i, isCompleted: false })),
  },
  {
    id: 5,
    orderIndex: 5,
    title: "Funktioner & Algoritmer",
    description: "Återanvändbar kod och komplexa pussellösningar.",
    isUnlocked: false,
    progressPercent: 0,
    exercises: Array.from({ length: 15 }, (_, i) => ({ id: 501 + i, isCompleted: false })),
  },
];

function Exercises() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [modulesRes, profileRes] = await Promise.all([
          fetchWithAuth("/exercises/modules"),
          fetchWithAuth("/auth/profile"),
        ]);

        if (modulesRes.ok) {
          const data = await modulesRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setLevels(data);
          } else {
            setLevels(DEFAULT_MODULES);
          }
        } else {
          setLevels(DEFAULT_MODULES);
        }

        if (profileRes.ok) {
          const prof = await profileRes.json();
          setUserProfile(prof);
        }
      } catch (err) {
        console.error("Kunde inte hämta moduler:", err);
        setLevels(DEFAULT_MODULES);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalModules = levels.length || 5;
  const unlockedLevels = levels.filter((l) => l.isUnlocked);
  const unlockedCount = unlockedLevels.length;
  const unlockPercent = Math.round((unlockedCount / totalModules) * 100);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-pulse">
          <div className="h-8 bg-surface-container rounded-lg w-48"></div>
          <div className="h-24 bg-surface-container rounded-xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 bg-surface-container-low rounded-xl border border-outline-variant p-6"
              ></div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header & Nordic Guidance Message */}
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant font-label-ui text-label-ui text-primary font-semibold">
              <span className="material-symbols-outlined text-[16px]">school</span>
              Kursplan &amp; Moduler
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-extrabold text-on-surface tracking-tight">
            Välj nivå
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Följ den pedagogiska trappan från grundläggande sekvenser till avancerade algoritmer. Klara minst 70% av en modul för att låsa upp nästa.
          </p>
        </header>

        {/* Module Stats Banner */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 lg:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
              <span
                className="material-symbols-outlined text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                insights
              </span>
            </div>
            <div>
              <p className="font-label-ui text-label-ui uppercase tracking-wider text-outline font-semibold">
                Din framgång
              </p>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Totalt {totalModules} moduler · {unlockedCount} upplåst{unlockedCount === 1 ? "" : "a"}
              </h2>
            </div>
          </div>

          {/* Overall Linear Progression Bar */}
          <div className="w-full md:w-72 flex flex-col gap-2">
            <div className="flex justify-between items-center font-label-ui text-label-ui text-on-surface-variant">
              <span>Nivåupplåsning</span>
              <span className="font-bold text-primary">{unlockPercent}% genomfört</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-tertiary-container to-secondary-container rounded-full transition-all duration-500"
                style={{ width: `${unlockPercent}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Level Cards Grid (Bento & Modern Card Grid) */}
        <section aria-label="Moduler och nivåer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const unlocked = level.isUnlocked;
            const progress = level.progressPercent ?? 0;
            const levelNum = level.orderIndex || index + 1;
            const tags = CONCEPT_TAGS[levelNum] || ["Kodblock", "Algoritm", "Logik"];
            const totalExercises = level.exercises?.length ?? 0;
            const completedExercises =
              level.exercises?.filter((e) => e.isCompleted).length ?? 0;
            const prevModule =
              levels.find((m) => (m.orderIndex || 0) === levelNum - 1) ||
              levels[index - 1];

            if (unlocked) {
              return (
                <article
                  key={level.id || index}
                  className="relative flex flex-col justify-between bg-surface-container-lowest rounded-xl border-2 border-primary-container p-6 shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Top Tag Cluster */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-label-code-md text-label-code-md text-primary font-bold px-2.5 py-1 bg-primary-fixed rounded-lg">
                        Nivå {levelNum}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-label-ui text-label-ui font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {progress === 100 ? "Avklarad" : "Öppen / Pågående"}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                        {level.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                        {level.description}
                      </p>
                    </div>

                    {/* Pedagogical Concept Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-label-code-sm text-label-code-sm px-2 py-0.5 bg-surface-container rounded text-on-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progression Section & Action */}
                  <div className="flex flex-col gap-4 mt-6 pt-5 border-t border-outline-variant">
                    <div className="flex justify-start items-center font-label-ui text-label-ui">
                      <span className="font-semibold text-on-surface">
                        {totalExercises > 0
                          ? `${completedExercises}/${totalExercises} övningar klara`
                          : `${progress}% klart`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/exercises/${level.id}`)}
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-ui text-label-ui font-bold py-3 px-5 rounded-lg tactile-bevel shadow-sm hover:opacity-95 transition-all duration-150 active:translate-y-0.5 cursor-pointer"
                    >
                      Öppna nivå →
                    </button>
                  </div>
                </article>
              );
            }

            // Locked Card
            const prevProgress = prevModule?.progressPercent ?? 0;
            const neededPercent = Math.max(0, 70 - prevProgress);

            return (
              <article
                key={level.id || index}
                className="relative flex flex-col justify-between bg-surface-container-low rounded-xl border border-outline-variant p-6 opacity-90 transition-all duration-200 hover:border-outline"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label-code-md text-label-code-md text-on-surface-variant font-semibold px-2.5 py-1 bg-surface-container rounded-lg">
                      Nivå {levelNum}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-ui text-label-ui font-medium">
                      <span className="material-symbols-outlined text-[16px]" data-icon="lock">
                        lock
                      </span>
                      Låst
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      {level.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                      {level.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-label-code-sm text-label-code-sm px-2 py-0.5 bg-surface-container rounded text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirement & Locked Button */}
                <div className="flex flex-col gap-4 mt-6 pt-5 border-t border-outline-variant">
                  <div className="flex justify-between items-center font-label-ui text-label-ui text-on-surface-variant">
                    <span>{totalExercises > 0 ? `0/${totalExercises} övningar` : "0 övningar"}</span>
                    <span className="text-outline">0% klart</span>
                  </div>

                  <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-outline-variant rounded-full" style={{ width: "0%" }}></div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-container-highest/60 border border-outline-variant font-body-sm text-body-sm text-on-surface-variant">
                    <span
                      className="material-symbols-outlined text-[18px] text-outline flex-shrink-0 mt-0.5"
                      data-icon="lock"
                    >
                      lock
                    </span>
                    <span>
                      {prevModule
                        ? `Klara minst 70% av föregående nivå (saknas ${neededPercent}%)`
                        : `Kräver godkänd Nivå ${levelNum - 1}`}
                    </span>
                  </div>

                  <button
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-surface-container text-outline font-label-ui text-label-ui font-semibold py-3 px-5 rounded-lg cursor-not-allowed border border-outline-variant select-none"
                    disabled
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Låst
                  </button>
                </div>
              </article>
            );
          })}

          {/* Bento Extra Card: Pedagogisk Guidning & Kodblock Teaser */}
          <article className="relative flex flex-col justify-between bg-surface-container-highest/40 rounded-xl border border-dashed border-outline p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-label-ui text-label-ui font-bold">
                <span className="material-symbols-outlined text-primary-container">lightbulb</span>
                Pedagogiskt tips
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Hur låser jag upp snabbare?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Varje övning har stjärnmål. Få full poäng genom att lösa pusslet med färre block än maxgränsen.
              </p>
              {/* Mini visual mock of blocks */}
              <div className="mt-3 flex flex-col gap-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-xs">
                <div className="flex items-center gap-2 text-on-primary bg-primary-container px-3 py-1.5 rounded text-xs font-label-code-sm tactile-bevel">
                  <span className="opacity-40 select-none">⋮⋮</span>
                  <span>upprepa tills (vid mål)</span>
                </div>
                <div className="ml-4 flex items-center gap-2 text-on-primary bg-amber-500 px-3 py-1.5 rounded text-xs font-label-code-sm tactile-bevel">
                  <span className="opacity-40 select-none">⋮⋮</span>
                  <span>gå framåt 1 steg</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-2">
              <Link
                className="text-primary font-label-ui text-label-ui font-bold hover:underline inline-flex items-center gap-1"
                to="/404"
              >
                Läs om bedömningsmatrisen
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </article>
        </section>
      </div>
    </AppLayout>
  );
}

export default Exercises;
