import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { storage } from "@/lib/storage";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import DashboardPage from "./pages/DashboardPage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import ChatbotPage from "./pages/ChatbotPage";
import DoctorConnectPage from "./pages/DoctorConnectPage";
import HealthHistoryPage from "./pages/HealthHistoryPage";
import AwarenessPage from "./pages/AwarenessPage";
import PrecautionsPage from "./pages/PrecautionsPage";
import RemindersPage from "./pages/RemindersPage";
import MoodPage from "./pages/MoodPage";
import RiskPredictionPage from "./pages/RiskPredictionPage";
import BehaviorSimulatorPage from "./pages/BehaviorSimulatorPage";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();
  const [hasName, setHasName] = useState(!!storage.get<string>('detecther_name', ''));

  useEffect(() => {
    setHasName(!!storage.get<string>('detecther_name', ''));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  if (!hasName) {
    return (
      <Routes>
        <Route path="*" element={<WelcomePage onComplete={() => setHasName(true)} />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/symptoms" element={<SymptomCheckerPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/doctors" element={<DoctorConnectPage />} />
        <Route path="/history" element={<HealthHistoryPage />} />
        <Route path="/awareness" element={<AwarenessPage />} />
        <Route path="/precautions" element={<PrecautionsPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/prediction" element={<RiskPredictionPage />} />
        <Route path="/simulator" element={<BehaviorSimulatorPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
