import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Shield, Video, FileText, Clock, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Your Health, <span className="text-primary">One Click Away</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with certified doctors instantly through secure video consultations. 
              Quality healthcare from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-gradient-primary hover:opacity-90 shadow-primary text-lg px-8"
              >
                Book a Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/find-doctors')}
                className="text-lg px-8"
              >
                Find Doctors
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose MediConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Verified Doctors</h3>
              <p className="text-muted-foreground">
                All doctors are thoroughly verified and certified professionals
              </p>
            </Card>

            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Video Calls</h3>
              <p className="text-muted-foreground">
                HIPAA-compliant video consultations with high-quality connection
              </p>
            </Card>

            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Digital Prescriptions</h3>
              <p className="text-muted-foreground">
                Receive e-prescriptions directly after your consultation
              </p>
            </Card>

            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">24/7 Availability</h3>
              <p className="text-muted-foreground">
                Book appointments that fit your schedule, anytime
              </p>
            </Card>

            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Activity className="h-7 w-7 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Health Records</h3>
              <p className="text-muted-foreground">
                Access your complete medical history in one secure place
              </p>
            </Card>

            <Card className="p-6 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Multiple Specialties</h3>
              <p className="text-muted-foreground">
                Connect with specialists across various medical fields
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-card shadow-elevated">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust MediConnect for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-gradient-primary hover:opacity-90 shadow-primary text-lg px-8"
              >
                Sign Up Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/about')}
                className="text-lg px-8"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">MediConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MediConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;