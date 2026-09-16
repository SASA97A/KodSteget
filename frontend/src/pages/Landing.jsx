import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* TopNavBar (Shared Component) */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm w-full">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2.5 group active:scale-95 transition-transform duration-150" to="/">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shadow-primary/20">
                <span className="material-symbols-outlined text-2xl" data-icon="terminal">terminal</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">KodSteget</span>
              </div>
            </Link>
          </div>

          {/* Trailing Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-primary font-medium hover:text-primary transition-colors duration-150 active:scale-95 font-label-ui text-label-ui"
            >
              Logga in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all duration-150 font-label-ui text-label-ui"
            >
              Skapa konto
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-grow">
        <section
          className="relative overflow-hidden py-16 md:py-24 bg-surface"
          id="oversikt"
        >
          {/* Subtle Decorative Background Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-secondary-fixed opacity-40 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-6 space-y-6 text-left">
                {/* Badge / Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
                  <span className="font-label-ui text-label-ui text-on-surface">
                    Visuell programmering för alla åldrar
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface">
                  Lär dig programmera steg för steg med{" "}
                  <span className="text-primary-container">kodblock</span>
                </h1>

                {/* Descriptive Subtitle */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                  Interaktiv och praktisk inlärning utan syntaxångest. Bygg
                  logiskt tänkande, skapa algoritmer och se resultatet direkt i
                  en trygg nordisk lärandemiljö.
                </p>

                {/* Actions Cluster */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    to="/register"
                    className="btn-depress inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-tertiary-container text-on-tertiary font-bold rounded-lg shadow-md hover:brightness-105 active:scale-[0.98] font-label-ui text-label-ui"
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      data-icon="play_arrow"
                    >
                      play_arrow
                    </span>
                    <span>Börja koda gratis</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold rounded-lg border border-outline-variant shadow-sm transition-all active:scale-95 font-label-ui text-label-ui"
                  >
                    Redan medlem? Logga in
                  </Link>
                </div>

                {/* Micro Social Proof & Metrics */}
                <div className="pt-4 flex items-center gap-6 border-t border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-tertiary-container"
                      data-icon="check_circle"
                    >
                      check_circle
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      100% webbaserat
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-primary-container"
                      data-icon="school"
                    >
                      school
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Anpassat för skolor &amp; nybörjare
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tactile Coding Workspace Mockup */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xl p-4 sm:p-6 overflow-hidden">
                  {/* Workspace Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-error opacity-80" />
                      <div className="w-3 h-3 rounded-full bg-amber-400 opacity-80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-80" />
                      <span className="ml-2 font-label-code-sm text-label-code-sm text-on-surface-variant">
                        Uppdrag 01: Navigera roboten
                      </span>
                    </div>
                  </div>

                  {/* Interactive Visual Blocks Stack Canvas */}
                  <div className="space-y-2.5 font-label-code-md text-label-code-md">
                    {/* Block 1: Event Loop (Indigo/Primary) */}
                    <div className="block-bevel rounded-lg bg-primary-container text-on-primary p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 select-none text-xs">⋮⋮</span>
                        <span
                          className="material-symbols-outlined text-sm"
                          data-icon="play_circle"
                        >
                          play_circle
                        </span>
                        <span className="font-bold">när_programmet_startar()</span>
                      </div>
                      <span className="font-label-code-sm text-label-code-sm bg-primary px-2 py-0.5 rounded text-white/90">
                        Start
                      </span>
                    </div>

                    {/* Block 2: Repeat Loop (Indented child container) */}
                    <div className="ml-4 pl-3 border-l-2 border-primary-container space-y-2">
                      {/* Loop Header */}
                      <div className="block-bevel rounded-lg bg-indigo-600 text-white p-3 flex items-center gap-2">
                        <span className="text-white/60 select-none text-xs">⋮⋮</span>
                        <span
                          className="material-symbols-outlined text-sm"
                          data-icon="repeat"
                        >
                          repeat
                        </span>
                        <span>upprepa</span>
                        <span className="bg-surface-container-lowest text-primary font-bold px-2 py-0.5 rounded text-xs border border-indigo-200">
                          4 ggr
                        </span>
                        <span>utför:</span>
                      </div>

                      {/* Inner Children */}
                      <div className="ml-4 pl-3 border-l-2 border-indigo-300 space-y-2">
                        {/* Conditional Block: Orange/Amber Logic */}
                        <div className="block-bevel rounded-lg bg-amber-600 text-white p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 select-none text-xs">⋮⋮</span>
                            <span
                              className="material-symbols-outlined text-sm"
                              data-icon="alt_route"
                            >
                              alt_route
                            </span>
                            <span>om (hinder_framför)</span>
                          </div>
                        </div>

                        {/* Action inside condition: Cyan/Secondary */}
                        <div className="ml-4 block-bevel rounded-lg bg-secondary text-on-secondary p-2.5 flex items-center gap-2">
                          <span className="text-white/60 select-none text-xs">⋮⋮</span>
                          <span
                            className="material-symbols-outlined text-sm"
                            data-icon="turn_left"
                          >
                            turn_left
                          </span>
                          <span>sväng_vänster()</span>
                        </div>

                        {/* Step forward action */}
                        <div className="block-bevel rounded-lg bg-secondary text-on-secondary p-2.5 flex items-center gap-2">
                          <span className="text-white/60 select-none text-xs">⋮⋮</span>
                          <span
                            className="material-symbols-outlined text-sm"
                            data-icon="arrow_forward"
                          >
                            arrow_forward
                          </span>
                          <span>gå_framåt(1)</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulation Success Toast Docked at Bottom */}
                    <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="material-symbols-outlined text-emerald-600 text-lg"
                          data-icon="task_alt"
                        >
                          task_alt
                        </span>
                        <span className="font-label-ui text-label-ui text-emerald-900 font-bold">
                          Alla 3 tester passerade galant!
                        </span>
                      </div>
                      <span className="font-label-ui text-label-ui text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                        +50 XP
                      </span>
                    </div>
                  </div>

                  {/* Workspace Interactive Controls Bar */}
                  <div className="mt-5 pt-3 border-t border-outline-variant flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                      <span
                        className="material-symbols-outlined text-sm text-primary"
                        data-icon="info"
                      >
                        info
                      </span>
                      Dra och släpp block för att testa
                    </span>
                    <Link
                      to="/register"
                      className="btn-depress px-4 py-2 bg-tertiary-container hover:brightness-105 text-on-tertiary rounded-lg font-label-ui text-label-ui font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <span
                        className="material-symbols-outlined text-sm"
                        data-icon="play_arrow"
                      >
                        play_arrow
                      </span>
                      Kör kod
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 USPs / Feature Highlights Bento */}
        <section
          className="py-20 bg-surface-container-lowest border-y border-outline-variant"
          id="metod"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="font-label-ui text-label-ui text-primary uppercase tracking-wider font-bold">
                En beprövad metodik
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Hur KodSteget gör programmering naturligt
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Vi bryter ner barriärer och lär ut algoritmiskt tänkande genom
                interaktiv feedback och spelmoment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* USP Card 1 */}
              <div className="rounded-xl p-8 bg-surface border border-outline-variant hover:-translate-y-1 transition-all duration-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center mb-6 shadow-sm">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="extension"
                    >
                      extension
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 font-bold">
                    1. Blockprogrammering
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Bygg logik visuellt utan krånglig syntax och borttappade
                    semikolon. Pusselbitarna passar bara ihop när logiken är giltig.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-2 text-primary font-label-ui text-label-ui font-semibold"
                >
                  <span>Utforska blockbiblioteket</span>
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* USP Card 2 */}
              <div className="rounded-xl p-8 bg-surface border border-outline-variant hover:-translate-y-1 transition-all duration-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-tertiary-container text-on-tertiary flex items-center justify-center mb-6 shadow-sm">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="bolt"
                    >
                      bolt
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 font-bold">
                    2. Direkt feedback
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Kör din kod i realtid mot animerade simuleringar. Se omedelbart
                    om roboten eller koden klarar alla testfall med tydliga tips vid
                    fel.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-2 text-primary font-label-ui text-label-ui font-semibold"
                >
                  <span>Se simulatorn i aktion</span>
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* USP Card 3 */}
              <div className="rounded-xl p-8 bg-surface border border-outline-variant hover:-translate-y-1 transition-all duration-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-6 shadow-sm">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="military_tech"
                    >
                      military_tech
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 font-bold">
                    3. Tydlig progression
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Tjäna XP, håll igång streaks och lås upp nya avancerade
                    kodmoduler allt eftersom du bemästrar grundläggande
                    datastrukturer.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-2 text-primary font-label-ui text-label-ui font-semibold"
                >
                  <span>Utforska nivåträdet</span>
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Teaser / Validation Section */}
        <section className="py-20 bg-surface-container-low relative" id="kom-igang">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 md:p-12 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-ui text-label-ui font-bold">
                    Interaktiv Förhandsvisning
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Klicka och se hur blocken dockas ihop
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    I KodSteget klickar eller drar du logikblock på plats.
                    Systemet kontrollerar koden direkt och ger vänlig vägledning
                    om något saknas.
                  </p>

                  {/* Progress bar representation */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between font-label-ui text-label-ui">
                      <span className="text-on-surface font-semibold">
                        Nybörjarnivå 1
                      </span>
                      <span className="text-primary font-bold">
                        85% Genomfört
                      </span>
                    </div>
                    <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: "85%" }}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 text-primary font-bold hover:underline font-label-ui text-label-ui"
                    >
                      <span>Starta din första lektion nu</span>
                      <span
                        className="material-symbols-outlined text-sm"
                        data-icon="arrow_forward"
                      >
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Visual Snap-in Demonstration Simulator */}
                <div className="lg:col-span-7 bg-surface p-6 rounded-xl border border-outline-variant space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                    <span className="font-label-ui text-label-ui text-on-surface-variant font-bold">
                      Simulerat drag-och-släpp
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Validerad logik
                    </span>
                  </div>

                  {/* Drag Target Slot */}
                  <div className="space-y-3">
                    <div className="block-bevel rounded-lg bg-primary-container text-white p-3 font-label-code-md text-label-code-md flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-sm"
                        data-icon="terminal"
                      >
                        terminal
                      </span>
                      <span>starta_sekvens()</span>
                    </div>

                    {/* Drop Target Slot Area (Highlighted Snap Zone) */}
                    <div className="p-3 border-2 border-dashed border-primary/50 bg-primary-fixed/20 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="material-symbols-outlined text-primary"
                          data-icon="drag_indicator"
                        >
                          drag_indicator
                        </span>
                        <span className="font-label-code-md text-label-code-md text-primary font-semibold">
                          sväng_höger(90)
                        </span>
                      </div>
                      <span className="font-label-ui text-label-ui text-primary bg-surface-container-lowest px-2 py-1 rounded shadow-xs">
                        Dockad ✓
                      </span>
                    </div>

                    <div className="block-bevel rounded-lg bg-secondary text-white p-3 font-label-code-md text-label-code-md flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-sm"
                        data-icon="fast_forward"
                      >
                        fast_forward
                      </span>
                      <span>accelerera(hastighet = 2)</span>
                    </div>
                  </div>

                  {/* Success Alert Banner */}
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start gap-3 mt-4">
                    <span
                      className="material-symbols-outlined text-emerald-700 text-xl flex-shrink-0"
                      data-icon="verified"
                    >
                      verified
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-sm font-bold text-emerald-900">
                        Utmärkt lösning!
                      </h4>
                      <p className="font-body-sm text-body-sm text-emerald-800">
                        Alla steg utfördes i korrekt ordning och roboten nådde
                        målet utan kollision.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant flex-none z-30">
        <div className="flex justify-center items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <span className="text-on-surface-variant font-label-ui text-label-ui">© 2026 KodSteget</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

