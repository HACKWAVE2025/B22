import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, UserCheck, Clock, CheckCircle, XCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    approvedDoctors: 0,
    pendingDoctors: 0,
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

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
    }
  };

  const fetchDashboardData = async () => {
    // Fetch pending doctor verifications
    const { data: pending } = await supabase
      .from('doctor_profiles')
      .select(`
        *,
        user:user_id (
          id,
          profiles!doctor_profiles_user_id_fkey (full_name, email)
        )
      `)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (pending) {
      setPendingDoctors(pending);
    }

    // Fetch stats
    const { count: totalDocs } = await supabase
      .from('doctor_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: approvedDocs } = await supabase
      .from('doctor_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'approved');

    const { count: pendingDocs } = await supabase
      .from('doctor_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    const { count: totalPts } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    setStats({
      totalDoctors: totalDocs || 0,
      approvedDoctors: approvedDocs || 0,
      pendingDoctors: pendingDocs || 0,
      totalPatients: totalPts || 0,
    });
  };

  const handleVerification = async (doctorId: string, userId: string, action: 'approved' | 'rejected') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('doctor_profiles')
        .update({
          verification_status: action,
          verified_at: action === 'approved' ? new Date().toISOString() : null,
          verified_by: user?.id,
        })
        .eq('id', doctorId);

      if (error) throw error;

      toast.success(`Doctor ${action === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update verification status');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage doctors and platform</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Doctors</h3>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalDoctors}</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Approved</h3>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.approvedDoctors}</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.pendingDoctors}</p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Patients</h3>
              <UserCheck className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalPatients}</p>
          </Card>
        </div>

        {/* Pending Verifications */}
        <Card className="p-6 shadow-elevated">
          <h2 className="text-xl font-semibold text-foreground mb-6">Pending Doctor Verifications</h2>
          {pendingDoctors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingDoctors.map((doctor) => (
                <Card key={doctor.id} className="p-4 border-l-4 border-l-warning">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          Dr. {doctor.user?.profiles?.full_name || 'Unknown'}
                        </h3>
                        <Badge className="bg-warning/10 text-warning">Pending</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Email: {doctor.user?.profiles?.email}</p>
                        <p>Specialization: {doctor.specialization}</p>
                        <p>License: {doctor.license_number}</p>
                        <p>Experience: {doctor.years_of_experience} years</p>
                        <p>Qualification: {doctor.qualification}</p>
                        {doctor.bio && <p className="mt-2 text-xs">Bio: {doctor.bio}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleVerification(doctor.id, doctor.user_id, 'approved')}
                        className="bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerification(doctor.id, doctor.user_id, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
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

export default AdminDashboard;