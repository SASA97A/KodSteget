import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function Results() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetchWithAuth("/submissions/history");
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Kunde inte ladda historik:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const totalSubmissions = history.length;
  const passedCount = history.filter((h) => h.isPassed).length;
  const successRate = totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  
  // Calculate this week's submissions (mocked as last 7 days from now)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeekCount = history.filter(h => new Date(h.submittedAt) >= oneWeekAgo).length;

  // Pagination logic
  const totalPages = Math.ceil(totalSubmissions / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">autorenew</span>
          <p className="font-headline-sm font-bold text-primary">Laddar resultat...</p>
        </div>
      </AppLayout>
    );
  }

  // Helper function to format date nicely
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString("sv-SE", { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Idag, ${time}`;
    if (isYesterday) return `Igår, ${time}`;
    
    return date.toLocaleDateString("sv-SE", { dateStyle: "short" }) + `, ${time}`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
        {/* Sidhuvud */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Dina resultat & körningar</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Revisionslogg och prestationsanalys för dina inlämnade lösningar och testkörningar.
            </p>
          </div>
        </div>

        {/* Statistiksammanfattning (3 KPI-kort i rad) */}
        <section aria-label="Statistiköversikt" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kort 1: Totalt inskickade lösningar */}
          <div className="tactile-card bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6 flex flex-col justify-between group hover:border-primary transition-all duration-200 min-h-[170px]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Totalt inskickade lösningar</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-headline-xl text-headline-xl font-extrabold text-on-surface tracking-tight">{totalSubmissions}</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface-variant">körningar</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container flex-shrink-0 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined text-2xl" data-icon="send">send</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t border-outline-variant/60">
              <span className="inline-flex items-center gap-1 font-label-ui text-label-ui text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-sm font-bold" data-icon="trending_up">trending_up</span>
                +{thisWeekCount} denna vecka
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Jämfört med förra veckan</span>
            </div>
          </div>

          {/* Kort 2: Godkända lösningar */}
          <div className="tactile-card bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6 flex flex-col justify-between group hover:border-emerald-500 transition-all duration-200 min-h-[170px]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Godkända lösningar</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-headline-xl text-headline-xl font-extrabold text-emerald-600 tracking-tight">{passedCount}</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-emerald-600">st</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform duration-200">
                <span className="material-symbols-outlined fill-icon text-2xl" data-icon="check_circle">check_circle</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-2 border-t border-outline-variant/60">
              <span className="inline-flex items-center gap-1 font-label-ui text-label-ui text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-sm" data-icon="verified">verified</span>
                {successRate}% godkända
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{totalSubmissions - passedCount} behöver justeras</span>
            </div>
          </div>

          {/* Kort 3: Framgångsgrad med cirkulär mätare */}
          <div className="tactile-card bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-6 flex flex-col justify-between group hover:border-primary transition-all duration-200 min-h-[170px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="font-label-ui text-label-ui text-on-surface-variant font-medium">Framgångsgrad</span>
                <span className="font-headline-md text-headline-md font-extrabold text-on-surface tracking-tight mt-1 leading-tight">
                  {successRate >= 80 ? 'Hög noggrannhet' : successRate >= 50 ? 'Godkänt' : 'Kämpa på!'}
                </span>
              </div>
              {/* Circular Progress Indicator */}
              <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" fill="transparent" r="32" stroke="#eff4ff" strokeWidth="7"></circle>
                  <circle cx="40" cy="40" fill="transparent" r="32" stroke="#3525cd" strokeDasharray="201.06" strokeDashoffset={201.06 - (201.06 * successRate) / 100} strokeLinecap="round" strokeWidth="7"></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">{successRate}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-4 mt-2 border-t border-outline-variant/60">
              <span className="material-symbols-outlined text-primary text-base" data-icon="workspace_premium">workspace_premium</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Över genomsnittet (74%)</span>
            </div>
          </div>
        </section>

        {/* Historikvy / Tabell över tidigare körningar */}
        <section aria-label="Körningshistorik" className="tactile-card bg-surface-container-lowest rounded-xl border border-outline-variant/60 overflow-hidden flex flex-col shadow-sm w-full">
          {history.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">history</span>
              <h3 className="font-headline-md font-bold text-on-surface mb-2">Ingen historik än</h3>
              <p className="text-on-surface-variant font-body-md mb-6 max-w-md">
                Du har inte skickat in några övningar ännu. Gå till övningsvyn för att komma igång med programmeringen!
              </p>
              <button onClick={() => navigate("/exercises")} className="tactile-btn bg-primary text-on-primary font-label-ui font-bold px-6 py-3 rounded-xl flex items-center gap-2">
                <span>Gå till övningar</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          ) : (
            <>
              {/* Datatabell */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/60 text-on-surface-variant font-label-ui text-label-ui tracking-wider uppercase">
                      <th className="py-3.5 px-6 font-semibold" scope="col">Status</th>
                      <th className="py-3.5 px-6 font-semibold" scope="col">Övning</th>
                      <th className="py-3.5 px-6 font-semibold" scope="col">Nivå</th>
                      <th className="py-3.5 px-6 font-semibold" scope="col">Inskickad kod</th>
                      <th className="py-3.5 px-6 font-semibold" scope="col">Datum/Tid</th>
                      <th className="py-3.5 px-6 font-semibold text-right" scope="col">Åtgärd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {currentItems.map((item) => (
                      <tr key={item.id} className={`transition-colors duration-150 group ${item.isPassed ? 'hover:bg-surface/80' : 'hover:bg-surface/80 bg-error-container/10'}`}>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            <span className="material-symbols-outlined text-sm font-bold">
                              {item.isPassed ? 'check' : 'close'}
                            </span>
                            {item.isPassed ? 'Godkänd' : 'Ej godkänd'}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-headline-sm text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                            {item.exerciseId}. {item.exerciseTitle}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Nivå {item.moduleId} - {item.moduleTitle}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`font-label-code-sm text-label-code-sm font-semibold px-2.5 py-1 rounded border max-w-[200px] truncate inline-block ${item.isPassed ? 'bg-surface-container text-primary border-outline-variant/60' : 'bg-red-50 text-red-700 border-red-200'}`} title={item.submittedCode}>
                            {item.submittedCode || "Ingen kod"}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-body-sm text-body-sm text-on-surface-variant">
                          {formatDateTime(item.submittedAt)}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <button onClick={() => navigate(`/exercises/${item.moduleId}/${item.exerciseId}`)} className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-ui text-label-ui font-bold hover:underline transition-all duration-150" type="button">
                            Öppna
                            <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginering i botten */}
              <div className="px-6 py-4 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Visar <strong className="font-semibold text-on-surface">{Math.min(startIndex + 1, totalSubmissions)}–{Math.min(startIndex + itemsPerPage, totalSubmissions)}</strong> av <strong className="font-semibold text-on-surface">{totalSubmissions}</strong> resultat
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-outline-variant/60 text-outline font-label-ui text-label-ui disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors" 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
                    <span>Föregående</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {/* Simplified pagination dots for typical scale */}
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg font-label-ui text-label-ui font-semibold flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-primary text-on-primary font-bold shadow-xs' : 'hover:bg-surface-container text-on-surface'}`} 
                        type="button"
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-outline-variant/60 bg-surface hover:bg-surface-container-low text-on-surface font-label-ui text-label-ui shadow-2xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
                    type="button"
                  >
                    <span>Nästa</span>
                    <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default Results;
