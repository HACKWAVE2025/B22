import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Appointments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">My Appointments</h1>
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Appointments feature coming soon</p>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;