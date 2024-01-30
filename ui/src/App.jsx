import { AuthenticatePage } from "./pages/AuthenticatePage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatePage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
