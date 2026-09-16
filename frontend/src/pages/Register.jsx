import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage(""); // Rensa tidigare backend-meddelande vid inmatning

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

  // Bestäm valideringsstatus och visning
  const getValidationState = () => {
    if (message) {
      if (isError) {
        return {
          boxClass: "bg-error-container/30 border-error",
          iconClass: "text-error",
          icon: "cancel",
          titleClass: "text-error font-bold",
          title: "Kunde inte skapa konto",
          desc: message,
        };
      }
      return {
        boxClass: "bg-tertiary-fixed/40 border-tertiary",
        iconClass: "text-tertiary",
        icon: "verified",
        titleClass: "text-tertiary font-bold",
        title: "Kontot är skapat!",
        desc: "Välkommen till KodSteget! Du kan nu logga in med dina uppgifter.",
      };
    }

    if (!formData.password) {
      return {
        boxClass: "bg-surface-container-low border-outline-variant",
        iconClass: "text-outline",
        icon: "info",
        titleClass: "text-on-surface",
        title: "Lösenordskrav",
        desc: "Skriv minst 6 tecken med gärna en siffra för säkrare konto.",
      };
    }

    if (formData.password.length < 6) {
      return {
        boxClass: "bg-error-container/30 border-error",
        iconClass: "text-error",
        icon: "cancel",
        titleClass: "text-error font-bold",
        title: "För kort lösenord",
        desc: `Du behöver minst 6 tecken (just nu ${formData.password.length} tecken).`,
      };
    }

    return {
      boxClass: "bg-tertiary-fixed/30 border-tertiary",
      iconClass: "text-tertiary-container",
      icon: "check_circle",
      titleClass: "text-tertiary font-bold",
      title: "Utmärkt lösenord!",
      desc: "Lösenordet uppfyller säkerhetskraven. Du är redo att starta.",
    };
  };

  const validation = getValidationState();

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Top Navigation Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm w-full h-16 sticky top-0 z-50">
        <div className="flex justify-between items-center w-full h-full px-6 max-w-7xl mx-auto">
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
              Har du redan ett konto?
            </span>
            <Link
              className="font-label-ui text-label-ui font-semibold text-primary border border-primary/30 hover:border-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-all duration-150 active:scale-95"
              to="/login"
            >
              Logga in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-7xl mx-auto my-8">
        <section className="w-full max-w-md flex flex-col items-center">
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 border border-outline-variant shadow-sm w-full">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="material-symbols-outlined text-3xl" data-icon="terminal">terminal</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Skapa konto
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                Börja din resa inom visuell programmering
              </p>
            </div>

            {/* Registration Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Input Group */}
              <div className="flex flex-col gap-1.5 text-left">
                <label
                  className="font-label-ui text-label-ui text-on-surface font-medium"
                  htmlFor="email"
                >
                  E-postadress
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span
                      className="material-symbols-outlined text-[20px] select-none"
                      data-icon="mail"
                    >
                      mail
                    </span>
                  </div>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                    id="email"
                    name="email"
                    placeholder="din.epost@skola.se"
                    required
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Input Group */}
              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label
                    className="font-label-ui text-label-ui text-on-surface font-medium"
                    htmlFor="password"
                  >
                    Lösenord
                  </label>
                  <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                    Minst 6 tecken
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <span
                      className="material-symbols-outlined text-[20px] select-none"
                      data-icon="lock"
                    >
                      lock
                    </span>
                  </div>
                  <input
                    className="w-full pl-11 pr-11 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-code-md text-label-code-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                    id="password"
                    minLength="6"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    aria-label="Visa eller dölj lösenord"
                    className="absolute right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span
                      className="material-symbols-outlined text-[20px] select-none"
                      data-icon="visibility"
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Status / Validation Feedback Panel */}
              <div
                className={`rounded-lg p-3.5 border transition-all duration-200 text-left ${validation.boxClass}`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`material-symbols-outlined shrink-0 mt-0.5 select-none ${validation.iconClass}`}
                    data-icon={validation.icon}
                  >
                    {validation.icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`font-label-ui text-label-ui ${validation.titleClass}`}
                    >
                      {validation.title}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {validation.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Primary Registration CTA Button */}
              <button
                className="w-full py-3 px-6 bg-primary hover:bg-[#2c1eb3] text-on-primary font-label-ui text-label-ui font-bold rounded-lg border-b-[3px] border-[#1d118a] shadow-md flex items-center justify-center gap-2 btn-depress transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                id="submitBtn"
                type="submit"
                disabled={loading}
              >
                <span className="font-bold">
                  {loading ? "Skapar ditt konto..." : "Skapa konto"}
                </span>
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-on-primary border-t-transparent" />
                ) : (
                  <span
                    className="material-symbols-outlined select-none"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                )}
              </button>
            </form>

            {/* Existing Account Switch Link */}
            <div className="mt-6 text-center">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Har du redan ett konto?
                <Link
                  className="font-bold text-primary hover:underline ml-1"
                  to="/login"
                >
                  Logga in
                </Link>
              </p>
            </div>

            {/* Privacy & Terms Notice */}
            <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant text-outline">
              Genom att skapa konto godkänner du våra{" "}
              <Link
                className="text-primary underline hover:text-on-primary-fixed-variant"
                to="/404"
              >
                Villkor
              </Link>{" "}
              och{" "}
              <Link
                className="text-primary underline hover:text-on-primary-fixed-variant"
                to="/404"
              >
                Integritetspolicy
              </Link>
              .
            </p>
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

export default Register;