import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "lucide-react";
import { toast } from "sonner";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter your symptoms before analyzing.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8080/api/check-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to analyze symptoms");
        return;
      }

      toast.success("✅ Analysis complete!");
      setResult(data.result); // Flask model output (JSON)
    } catch (error) {
      toast.error("❌ Server connection error. Please try again.");
      console.error("Symptom Checker Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-8 shadow-elevated">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Symptom Checker</h1>
            <p className="text-muted-foreground">
              Describe your symptoms to receive possible diagnoses and guidance.
            </p>
          </div>

          {/* Input & Button */}
          <div className="space-y-6">
            <Textarea
              placeholder="Example: I have fever, headache, and chills for 3 days..."
              rows={6}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />

            <Button
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
              disabled={loading}
              onClick={handleAnalyze}
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>

            {/* ✅ Display AI Result */}
            {result && (
              <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-muted shadow-sm">
                <h2 className="text-xl font-semibold mb-3 text-foreground">
                  🧠 AI Diagnosis Result
                </h2>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Disease:</strong> {result.predicted_disease || "N/A"}
                  </p>
                  <p>
                    <strong>Severity:</strong> {result.severity || "Unknown"}
                  </p>
                  {result.description && (
                    <p>
                      <strong>Description:</strong> {result.description}
                    </p>
                  )}
                  {result.precautions && (
                    <p>
                      <strong>Precautions:</strong> {result.precautions}
                    </p>
                  )}
                  {result.medication && (
                    <p>
                      <strong>Suggested Medication:</strong> {result.medication}
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-4 italic">
                  ⚠️ This is an AI-generated suggestion and should not replace professional medical advice.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
