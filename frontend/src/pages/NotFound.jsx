import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed antialiased relative overflow-x-hidden">
      {/* Background Tactile Grid Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0" style={{backgroundSize: "32px 32px", backgroundImage: "radial-gradient(circle, #c7c4d8 1px, transparent 1px)"}}></div>
      
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

      {/* Main Error Canvas (Nordic Algorithmic Visual Workspace) */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center">
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-error-container text-on-error-container text-label-ui font-label-ui mb-8 border border-error/20 shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span className="">Körningsfel • Felkod 404 (Sidan saknas)</span>
          </div>

          {/* Algorithmic Visual Block Stage */}
          <div className="w-full max-w-xl mb-10 text-left">
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant shadow-[0_12px_28px_-6px_rgba(15,23,42,0.08)] relative">
              {/* Block Window Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-error"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></span>
                  <span className="ml-2 font-label-code-sm text-label-code-sm text-on-surface-variant">rutig_canvas.ks</span>
                </div>
                <div className="flex items-center gap-1.5 font-label-code-sm text-label-code-sm text-outline">
                  <span className="material-symbols-outlined text-[16px]">bug_report</span>
                  <span className="">1 syntaktiskt brott</span>
                </div>
              </div>
              
              {/* Tactile Visual Coding Blocks Sequence */}
              <div className="space-y-3 font-label-code-md text-label-code-md">
                {/* Block 1: Control Flow (Indigo) */}
                <div className="bg-primary-container text-on-primary rounded-xl p-3.5 flex items-center gap-3 shadow-sm border-b-[3px] border-black/20">
                  <span className="opacity-40 select-none text-xs">⋮⋮</span>
                  <span className="font-bold">när_begäran_startar</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">väg: "/denna-länk"</span>
                  <span className="material-symbols-outlined text-sm ml-auto opacity-70">play_arrow</span>
                </div>
                
                {/* Block 2: Broken / Missing Code Block (Visual Slot Error) */}
                <div className="border-2 border-dashed border-error bg-error-container/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-transform hover:scale-[1.01]">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-error text-on-error flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </span>
                    <div>
                      <div className="font-label-code-sm text-label-code-sm font-bold text-error">block_not_found(status: 404)</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Sökt sida saknas i trädet</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-surface-container-lowest text-on-surface-variant px-2.5 py-1 rounded-md text-xs font-medium border border-outline-variant">
                    <span className="material-symbols-outlined text-[14px]">link_off</span>
                    <span className="">return null;</span>
                  </div>
                </div>
                
                {/* Block 3: Safe Fallback Action Block (Amber) */}
                <div className="bg-amber-500 text-white rounded-xl p-3.5 flex items-center gap-3 shadow-sm border-b-[3px] border-black/20 opacity-95">
                  <span className="opacity-40 select-none text-xs">⋮⋮</span>
                  <span className="font-bold">felsäker_omdirigering</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs">till: "Dashboard"</span>
                  <span className="material-symbols-outlined text-sm ml-auto opacity-70">check_circle</span>
                </div>
              </div>
              
              {/* Bottom Micro Notification */}
              <div className="mt-5 pt-3 border-t border-dashed border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5 font-label-ui text-label-ui">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
                  Status: Inga framsteg eller XP har påverkats
                </span>
                <span className="font-label-code-sm text-label-code-sm text-outline">Kodstatus: Avbruten</span>
              </div>
            </div>
          </div>
          
          {/* Swedish Pedagogical Text & Headlines */}
          <h1 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight mb-4">
            Oj, den här koden ledde ingenstans!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-8">
            Koden du sökte verkar ha brutits eller flyttats till en annan modul. Oroa dig inte – alla dina tidigare övningar och sparade framsteg är i tryggt förvar!
          </p>
          
          {/* Primary & Secondary Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-14">
            {/* Primary Action */}
            <Link className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-primary text-on-primary font-label-ui text-label-ui font-bold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all duration-150 border-b-[3px] border-black/25" to="/dashboard">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span className="">Tillbaka till instrumentpanelen</span>
            </Link>
            {/* Secondary Action */}
            <Link className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-ui text-label-ui font-semibold border border-outline-variant hover:bg-surface-container-low hover:text-primary active:scale-[0.98] transition-all duration-150" to="/exercises">
              <span className="material-symbols-outlined text-[20px] text-primary">extension</span>
              <span className="">Välj övningar</span>
            </Link>
          </div>
          
          {/* Quick Helpful Links Bento Grid */}
          <div className="w-full max-w-2xl bg-surface-container-lowest/80 backdrop-blur rounded-2xl p-6 border border-outline-variant">
            <p className="font-label-ui text-label-ui text-outline uppercase tracking-wider mb-4 text-xs font-semibold">
              Föreslagna destinationer i utbildningsplattformen
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <Link className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-all duration-150 group" to="/dashboard">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">dashboard</span>
                  <span className="font-headline-sm text-body-sm font-bold text-on-surface">Dashboard</span>
                </div>
                <p className="text-xs text-on-surface-variant">Överblick &amp; uppdrag</p>
              </Link>
              <Link className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-all duration-150 group" to="/exercises">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">extension</span>
                  <span className="font-headline-sm text-body-sm font-bold text-on-surface">Övningar</span>
                </div>
                <p className="text-xs text-on-surface-variant">Programmeringsbanor</p>
              </Link>
              <Link className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-all duration-150 group" to="/results">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">analytics</span>
                  <span className="font-headline-sm text-body-sm font-bold text-on-surface">Resultat</span>
                </div>
                <p className="text-xs text-on-surface-variant">Statistik &amp; färdigheter</p>
              </Link>
              <Link className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 transition-all duration-150 group" to="/">
                <div className="flex items-center gap-2 mb-1 text-primary">
                  <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">help</span>
                  <span className="font-headline-sm text-body-sm font-bold text-on-surface">Support</span>
                </div>
                <p className="text-xs text-on-surface-variant">Hjälp &amp; handledning</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Shared Component) */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant flex-none z-30">
        <div className="flex justify-center items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <span className="text-on-surface-variant font-label-ui text-label-ui">© 2026 KodSteget</span>
        </div>
      </footer>
    </div>
  );
}

export default NotFound;
