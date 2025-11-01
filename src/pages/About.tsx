import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">About MediConnect</h1>
          <Card className="p-8 shadow-elevated space-y-6">
            <p className="text-muted-foreground">
              MediConnect is revolutionizing healthcare by connecting patients with certified doctors 
              through secure, real-time video consultations.
            </p>
            <p className="text-muted-foreground">
              Our mission is to make quality healthcare accessible to everyone, regardless of location.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;