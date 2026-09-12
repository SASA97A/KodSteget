import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/kodsteget-hero.png";

function Register() {
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

  if (formData.password.length < 6) {
    setMessage("Lösenordet måste vara minst 6 tecken.");
    setIsError(true);
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "https://localhost:7016/api/auth/register",
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

    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Backend-svar:", responseText);

    let data = null;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }

    if (!response.ok) {
      setMessage(
        data?.message ||
          responseText ||
          "Registreringen misslyckades."
      );

      setIsError(true);
      return;
    }

    setMessage("Kontot skapades!");
    setIsError(false);

    setFormData({
      email: "",
      password: "",
    });
  } catch (error) {
    console.error("Fel vid registrering:", error);

    setMessage(`Fel: ${error.message}`);
    setIsError(true);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logo-box">{"</>"}</div>
          <span>KodSteget</span>
        </div>

        <button
          className="login-top"
          onClick={() => navigate("/login")}
        >
          LOGGA IN
        </button>
      </header>

      <main className="register-layout">
        <section className="info-section">
          <img src={heroImage} 
          alt="Lär dig programmering med KodSteget" 
          className="hero-image"/>

          <h2>
            Lär dig programmering steg för steg
          </h2>

          <p>
            Öva, testa och utvecklas genom roliga
            övningar och utmaningar. För nybörjare
            och alla som vill bli bättre.
          </p>

          <div className="features">
            <div className="feature">
              <div className="feature-icon">
                {"</>"}
              </div>

              <span>
                Lös övningar med kodblock
              </span>
            </div>

            <div className="feature">
              <div className="feature-icon">
                ✓
              </div>

              <span>
                Få direkt feedback
              </span>
            </div>

            <div className="feature">
              <div className="feature-icon">
                ↗
              </div>

              <span>
                Följ din utveckling
              </span>
            </div>
          </div>
        </section>

        <div className="divider"></div>

        <section className="form-section">
          <div className="form-wrapper">
            <h1>Skapa konto</h1>

            <p className="subtitle">
              Börja din resa idag
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="email">
                E-post
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Din e-postadress"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">
                Lösenord
              </label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Minst 6 tecken"
                minLength="6"
                value={formData.password}
                onChange={handleChange}
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
                  ? "Skapar konto..."
                  : "Skapa konto"}
              </button>

              <div className="or-row">
                <span></span>
                <p>eller</p>
                <span></span>
              </div>

              <button
                type="button"
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Logga in
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;