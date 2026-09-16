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
import NotFound from "./pages/NotFound.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
