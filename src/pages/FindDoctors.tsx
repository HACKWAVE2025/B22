import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Search, Star } from "lucide-react";

const FindDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const { data } = await supabase
      .from('doctor_profiles')
      .select(`
        *,
        user:user_id (
          profiles!doctor_profiles_user_id_fkey (full_name)
        )
      `)
      .eq('verification_status', 'approved');

    if (data) {
      setDoctors(data);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.user?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Find Doctors</h1>
        
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialization..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="p-6 shadow-card hover:shadow-elevated transition-all">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Dr. {doctor.user?.profiles?.full_name}
              </h3>
              <p className="text-primary font-medium mb-3">{doctor.specialization}</p>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p>Experience: {doctor.years_of_experience} years</p>
                <p>Qualification: {doctor.qualification}</p>
                <p className="text-foreground font-semibold">Fee: ${doctor.consultation_fee}</p>
              </div>
              <Button className="w-full bg-gradient-primary">Book Appointment</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;