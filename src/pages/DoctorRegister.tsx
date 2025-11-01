import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { z } from "zod";

const doctorSchema = z.object({
  specialization: z.string().trim().min(2).max(100),
  licenseNumber: z.string().trim().min(5).max(50),
  experience: z.number().min(0).max(60),
  qualification: z.string().trim().min(2).max(200),
  bio: z.string().trim().max(1000).optional(),
  fee: z.number().min(0).max(10000),
});

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    specialization: "",
    licenseNumber: "",
    experience: "",
    qualification: "",
    bio: "",
    fee: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = doctorSchema.parse({
        ...formData,
        experience: parseInt(formData.experience),
        fee: parseFloat(formData.fee),
      });

      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload certificate if provided
      let certificatePath = null;
      if (certificate) {
        const fileExt = certificate.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('doctor_certificates')
          .upload(fileName, certificate);

        if (uploadError) throw uploadError;
        certificatePath = fileName;
      }

      // Create doctor profile
      const { error: profileError } = await supabase
        .from('doctor_profiles')
        .insert({
          user_id: user.id,
          specialization: validated.specialization,
          license_number: validated.licenseNumber,
          years_of_experience: validated.experience,
          qualification: validated.qualification,
          bio: validated.bio,
          consultation_fee: validated.fee,
          verification_status: 'pending',
        });

      if (profileError) throw profileError;

      toast.success("Doctor profile submitted for verification!");
      navigate("/doctor-dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || "Failed to submit profile");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 shadow-elevated">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Doctor Profile</h1>
            <p className="text-muted-foreground">Provide your credentials for verification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Cardiologist"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="License number"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  placeholder="Years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Consultation Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                placeholder="e.g., MBBS, MD"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell patients about yourself..."
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate">Upload Medical Certificate</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="certificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {certificate && (
                  <span className="text-sm text-success flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    {certificate.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90" 
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorRegister;