import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { fetchWithAuth } from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetchWithAuth("/auth/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError("Kunde inte hämta profiluppgifter.");
        }
      } catch (err) {
        console.error("Fel vid laddning av profil:", err);
        setError("Kunde inte ansluta till servern.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: "40px" }}>Laddar profil...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar-large">
              <span>
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div>
              <h1>{user?.email || "Användare"}</h1>
              <p className="profile-subtitle">Medlem hos KodSteget</p>
            </div>
          </div>

          {error && <p className="message error">{error}</p>}

          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <span className="stat-label">Total XP</span>
              <strong className="stat-value">{user?.totalXp ?? 0}</strong>
            </div>

            <div className="profile-stat-card">
              <span className="stat-label">Nuvarande nivå</span>
              <strong className="stat-value">
                Nivå {user?.currentLevel ?? 1}
              </strong>
            </div>

            <div className="profile-stat-card">
              <span className="stat-label">Konto-ID</span>
              <span className="stat-subtext" title={user?.id}>
                {user?.id ? `${user.id.substring(0, 8)}...` : "-"}
              </span>
            </div>
          </div>

          <div className="profile-section-card">
            <h2>Kontouppgifter</h2>
            <div className="profile-field-row">
              <span className="field-name">E-postadress</span>
              <span className="field-value">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default Profile;
