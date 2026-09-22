import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
        `${BASE_URL}/auth/login`,
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



      localStorage.setItem("token", data.token);
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
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-surface selection:bg-primary selection:text-on-primary">
      {/* Header: Minimalistisk topbar anpassad för Transactional / Focused Auth Screen */}
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/60 shadow-sm z-30 sticky top-0">
        <div className="flex justify-between items-center w-full px-6 md:px-12 h-16 max-w-7xl mx-auto">
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
          <div className="flex items-center gap-4">
            <span className="text-on-surface-variant font-body-sm hidden sm:inline">
              Har du inget konto?
            </span>
            <Link
              className="font-label-ui text-label-ui font-semibold text-primary border border-primary/30 hover:border-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-all duration-150 active:scale-95"
              to="/register"
            >
              Skapa konto
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: Focused Auth Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 py-12">
        <div className="w-full max-w-md my-auto">
          <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-lg p-8 sm:p-10 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-on-primary shadow-sm mb-4">
                <span className="material-symbols-outlined text-3xl" data-icon="terminal">terminal</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Logga in
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                Välkommen tillbaka till KodSteget
              </p>
            </div>

            {/* Feedback-banner för meddelanden */}
            {message && (
              <div
                className={`mb-5 p-3.5 rounded-lg border text-sm flex items-start gap-2.5 transition-all duration-200 ${
                  isError
                    ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
                    : "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                }`}
                role="alert"
              >
                <span className="material-symbols-outlined text-base mt-0.5">
                  {isError ? "error" : "check_circle"}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-xs">
                    {isError ? "Kunde inte logga in" : "Klart!"}
                  </p>
                  <p className="text-xs">{message}</p>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block font-label-ui text-label-ui font-medium text-on-surface mb-1.5"
                  htmlFor="email"
                >
                  E-postadress
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px] select-none">
                      mail
                    </span>
                  </div>
                  <input
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-lg border border-outline-variant/80 bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    id="email"
                    name="email"
                    placeholder="namn@epost.se"
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    className="font-label-ui text-label-ui font-medium text-on-surface"
                    htmlFor="password"
                  >
                    Lösenord
                  </label>
                  <Link
                    className="font-label-ui text-label-ui text-primary hover:underline"
                    to="/404"
                  >
                    Glömt lösenord?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span className="material-symbols-outlined text-[20px] select-none">
                      lock
                    </span>
                  </div>
                  <input
                    className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-outline-variant/80 bg-surface-container-lowest font-label-code-md text-label-code-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    aria-label="Visa eller dölj lösenord"
                    className="absolute right-0 pr-3.5 flex items-center text-outline hover:text-on-surface focus:outline-none cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] select-none">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    className="w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary/30"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Kom ihåg mig
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-3 px-6 bg-primary hover:bg-[#2c1eb3] text-on-primary font-label-ui text-label-ui font-bold rounded-lg border-b-[3px] border-[#1d118a] shadow-md flex items-center justify-center gap-2 btn-depress transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Loggar in..." : "Logga in"}</span>
                  <span
                    className={`material-symbols-outlined text-base ${
                      loading ? "animate-spin" : ""
                    }`}
                  >
                    {loading ? "progress_activity" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-outline-variant/40 pt-4">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Har du inget konto?
                <Link
                  className="font-label-ui text-label-ui font-bold text-primary hover:underline ml-1"
                  to="/register"
                >
                  Skapa konto gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
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

export default Login;