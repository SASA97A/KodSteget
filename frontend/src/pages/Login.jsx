import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setIsError(false);

    try {
      setLoading(true);

      const response = await fetch(
        "https://localhost:7016/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Inloggningen misslyckades."
        );
        setIsError(true);
        return;
      }

      console.log("Login lyckades:", data);

      navigate("/dashboard");
    } catch (error) {
      console.error("Fel vid inloggning:", error);

      setMessage("Kunde inte ansluta till servern.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo-box">KS</div>
          <span>KodSteget</span>
        </div>

        <button
          className="login-top"
          onClick={() => navigate("/register")}
        >
          SKAPA KONTO
        </button>
      </header>

      <main className="register-layout">
        <section className="info-section">
          <div className="hero-image-placeholder">
            Bild / Illustration
          </div>

          <h2>Välkommen tillbaka till KodSteget</h2>

          <p>
            Logga in och fortsätt utveckla dina
            programmeringskunskaper där du slutade.
          </p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <span>Fortsätt dina övningar</span>
            </div>

            <div className="feature">
              <div className="feature-icon">↗</div>
              <span>Följ din progression</span>
            </div>

            <div className="feature">
              <div className="feature-icon">★</div>
              <span>Nå nästa nivå</span>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        <section className="form-section">
          <div className="form-wrapper">
            <h1>Logga in</h1>

            <p className="subtitle">
              Logga in på ditt KodSteget-konto
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">E-post</label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <label htmlFor="password">
                Lösenord
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              {message && (
                <p
                  className={
                    isError
                      ? "message error"
                      : "message success"
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >
                {loading
                  ? "Loggar in..."
                  : "Logga in"}
              </button>
            </form>

            <div className="or-row">
              <span></span>
              <p>eller</p>
              <span></span>
            </div>

            <button
              type="button"
              className="login-button"
              onClick={() => navigate("/register")}
            >
              Skapa konto
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;