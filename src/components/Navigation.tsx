import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Activity, Menu, X } from "lucide-react";

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (data) {
      setUserRole(data.role);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="border-b bg-card shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MediConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link to="/find-doctors" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Find Doctors
                </Link>
                <Link to="/symptom-checker" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Symptom Checker
                </Link>
                <Link to="/appointments" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Appointments
                </Link>
                <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </>
            )}
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (userRole === 'admin') navigate('/admin-dashboard');
                    else if (userRole === 'doctor') navigate('/doctor-dashboard');
                    else navigate('/patient-dashboard');
                  }}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')} className="text-sm">
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="text-sm bg-gradient-primary hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/find-doctors"
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Doctors
                </Link>
                <Link
                  to="/symptom-checker"
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Symptom Checker
                </Link>
                <Link
                  to="/appointments"
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Appointments
                </Link>
                <Link
                  to="/about"
                  className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </>
            )}
            <Link
              to="/contact"
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (userRole === 'admin') navigate('/admin-dashboard');
                    else if (userRole === 'doctor') navigate('/doctor-dashboard');
                    else navigate('/patient-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left"
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="w-full text-left">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-primary"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};