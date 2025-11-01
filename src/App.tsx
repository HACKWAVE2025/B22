import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorRegister from "./pages/DoctorRegister";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FindDoctors from "./pages/FindDoctors";
import SymptomChecker from "./pages/SymptomChecker";
import Appointments from "./pages/Appointments";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";


const queryClient = new QueryClient();

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />

            {/* Redirect logged-in users away from login/register */}
            <Route
              path="/login"
              element={token ? <Navigate to="/patient-dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={token ? <Navigate to="/patient-dashboard" replace /> : <Register />}
            />
            <Route
              path="/doctor-register"
              element={token ? <Navigate to="/doctor-dashboard" replace /> : <DoctorRegister />}
            />

            {/* Protected dashboards */}
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Other pages */}
            <Route path="/find-doctors" element={<FindDoctors />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
