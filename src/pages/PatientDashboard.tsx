import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Activity, Users } from "lucide-react";
import { toast } from "sonner";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [verified, setVerified] = useState(false);

  // ✅ Verify token and user from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    setUserName(user.fullName || "Patient");

    fetch("http://localhost:8080/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session expired, please log in again.");
        const data = await res.json();
        console.log("✅ Dashboard verified:", data);
        setVerified(true);
      })
      .catch((err) => {
        toast.error(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 🧭 Custom patient navbar */}
      <header className="w-full bg-white shadow-sm border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-primary">MediConnect</h2>
          <div className="flex items-center gap-4">
            <span className="text-foreground">👋 Hi, {userName}</span>
            <Button
              variant="outline"
              className="text-red-600 border-red-500 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* 📋 Dashboard body */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-muted-foreground">
            Manage your health and appointments
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 cursor-pointer hover:shadow-elevated transition-all"
            onClick={() => navigate("/find-doctors")}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Find Doctors</h3>
                <p className="text-sm text-muted-foreground">
                  Browse specialists
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-elevated transition-all"
            onClick={() => navigate("/symptom-checker")}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Symptom Checker
                </h3>
                <p className="text-sm text-muted-foreground">Check symptoms</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:shadow-elevated transition-all"
            onClick={() => navigate("/appointments")}
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  My Appointments
                </h3>
                <p className="text-sm text-muted-foreground">View & manage</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Appointments
            </h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Health Records
            </h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Prescriptions
            </h3>
            <p className="text-3xl font-bold text-foreground">0</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
