import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Landing from "./pages/Landing.jsx"; // <-- Ny import
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Exercises from "./pages/Exercises.jsx";
import ExerciseLevel from "./pages/ExerciseLevel.jsx";
import ExerciseTask from "./pages/ExerciseTask.jsx";
import Profile from "./pages/Profile.jsx";
import Results from "./pages/Results.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl mb-4 shadow-sm">
        404
      </div>
      <h1 className="font-headline-lg text-2xl md:text-3xl font-bold mb-2 tracking-tight">
        Sidan kunde inte hittas
      </h1>
      <p className="text-on-surface-variant max-w-md mb-6 font-body-md">
        Den här sidan finns inte ännu eller har flyttats.
      </p>
      <Link
        to="/"
        className="btn-depress px-6 py-3 bg-primary hover:bg-[#2c1eb3] text-on-primary font-label-ui font-bold rounded-lg shadow-md transition-all inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Tillbaka till startsidan
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Startsida för oinloggade besökare */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Skyddade app-vyer */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises"
          element={
            <ProtectedRoute>
              <Exercises />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/:level"
          element={
            <ProtectedRoute>
              <ExerciseLevel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/:level/:exerciseId"
          element={
            <ProtectedRoute>
              <ExerciseTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        {/* 404 and fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
