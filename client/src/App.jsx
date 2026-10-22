import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import useThemeStore from "./store/themeStore";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx"; 
import ResetPassword from "./pages/ResetPassword.jsx";   
import Dashboard from "./pages/Dashboard.jsx";
import Learn from "./pages/Learn.jsx";
import LessonDetail from "./pages/LessonDetail.jsx";
import Trade from "./pages/Trade.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import AiMentor from "./pages/AiMentor.jsx";
import Rewards from "./pages/Rewards.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--card-bg-solid)",
            color: "var(--text-primary)",
            border: "1px solid var(--text-muted)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<LessonDetail />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/ai-mentor" element={<AiMentor />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;