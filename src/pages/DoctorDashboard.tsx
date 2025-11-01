import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedToday: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (profile) {
      setDoctorName(profile.full_name);
    }

    const { data: doctorProfile } = await supabase
      .from('doctor_profiles')
      .select('verification_status')
      .eq('user_id', user.id)
      .single();

    if (doctorProfile) {
      setVerificationStatus(doctorProfile.verification_status);
    }
  };

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch today's appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patient_id (
          id,
          profiles!appointments_patient_id_fkey (full_name)
        )
      `)
      .eq('doctor_id', user.id)
      .gte('appointment_date', today.toISOString())
      .lt('appointment_date', tomorrow.toISOString())
      .order('appointment_date', { ascending: true });

    if (appointments) {
      setTodayAppointments(appointments);
    }

    // Fetch stats
    const { count: totalCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', user.id);

    const { count: completedCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('doctor_id', user.id)
      .gte('appointment_date', today.toISOString())
      .lt('appointment_date', tomorrow.toISOString())
      .eq('status', 'completed');

    const { data: patients } = await supabase
      .from('appointments')
      .select('patient_id')
      .eq('doctor_id', user.id);

    const uniquePatients = new Set(patients?.map(p => p.patient_id) || []);

    setStats({
      totalAppointments: totalCount || 0,
      completedToday: completedCount || 0,
      totalPatients: uniquePatients.size,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dr. {doctorName || 'Doctor'}
              </h1>
              <p className="text-muted-foreground">Manage your consultations and patients</p>
            </div>
            {verificationStatus && (
              <Badge className={getStatusColor(verificationStatus)}>
                {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        {verificationStatus === 'pending' && (
          <Card className="p-6 mb-8 border-l-4 border-l-warning bg-warning/5">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-warning mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  Your profile is under review. You'll be notified once verified.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Appointments</h3>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalAppointments}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Completed Today</h3>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.completedToday}</p>
            <p className="text-xs text-muted-foreground mt-1">Consultations</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Patients</h3>
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalPatients}</p>
            <p className="text-xs text-muted-foreground mt-1">Unique patients</p>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="p-6 shadow-elevated">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
            <Button variant="outline" onClick={() => navigate('/appointments')}>
              View All
            </Button>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((apt) => (
                <Card key={apt.id} className="p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {apt.patient?.profiles?.full_name || 'Unknown Patient'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(apt.appointment_date).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Reason: {apt.reason || 'General consultation'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                      {apt.status === 'scheduled' && (
                        <Button size="sm" className="bg-gradient-primary">
                          Start Call
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;