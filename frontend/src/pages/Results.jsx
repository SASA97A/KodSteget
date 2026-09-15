import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function Results() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar resultat...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="results-main">
        <div className="results-content">
          <div className="results-header">
            <div>
              <h1>Dina resultat</h1>
              <p>Här ser du alla dina tidigare körningar och inlämningar.</p>
            </div>
          </div>

          <div className="profile-stats-grid" style={{ marginBottom: "32px" }}>
            <div className="profile-stat-card">
              <span className="stat-label">Totalt inskickade</span>
              <strong className="stat-value">{totalSubmissions}</strong>
            </div>

            <div className="profile-stat-card">
              <span className="stat-label">Godkända svar</span>
              <strong className="stat-value" style={{ color: "#16a34a" }}>
                {passedCount}
              </strong>
            </div>

            <div className="profile-stat-card">
              <span className="stat-label">Framgångsgrad</span>
              <strong className="stat-value">
                {totalSubmissions > 0
                  ? Math.round((passedCount / totalSubmissions) * 100)
                  : 0}
                %
              </strong>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="results-empty">
              <p>Du har inte skickat in några övningar ännu.</p>
              <button
                type="button"
                className="create-button"
                style={{ marginTop: "16px", maxWidth: "200px" }}
                onClick={() => navigate("/exercises")}
              >
                Gå till övningar
              </button>
            </div>
          ) : (
            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Övning</th>
                    <th>Nivå</th>
                    <th>Kod</th>
                    <th>Datum</th>
                    <th>Åtgärd</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span
                          className={`results-badge ${
                            item.isPassed
                              ? "results-badge-pass"
                              : "results-badge-fail"
                          }`}
                        >
                          {item.isPassed ? "Godkänd" : "Ej godkänd"}
                        </span>
                      </td>
                      <td>
                        <strong>{item.exerciseTitle}</strong>
                      </td>
                      <td>{item.moduleTitle}</td>
                      <td>
                        <code className="results-code-snippet">
                          {item.submittedCode}
                        </code>
                      </td>
                      <td className="results-date">
                        {new Date(item.submittedAt).toLocaleString("sv-SE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="results-link-btn"
                          onClick={() =>
                            navigate(
                              `/exercises/${item.moduleId}/${item.exerciseId}`,
                            )
                          }
                        >
                          Öppna →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}

export default Results;
