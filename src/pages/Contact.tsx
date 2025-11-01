import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
          <Card className="p-8 shadow-elevated space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-foreground">support@mediconnect.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-foreground">1-800-MEDI-CONNECT</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;