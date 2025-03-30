
import { useState } from "react";
import { LearningProvider } from "@/context/LearningContext";
import EmailForm from "@/components/EmailForm";
import LearningDashboard from "@/components/LearningDashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LearningPage = () => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  return (
    <LearningProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Track My Learning</h1>
            <p className="text-muted-foreground mt-2">
              Personalized learning plans to help you grow your skills
            </p>
          </div>
          
          {!hasSubmitted ? (
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Enter your email to receive your personalized learning plan</CardDescription>
              </CardHeader>
              <CardContent>
                <EmailForm onSuccess={() => setHasSubmitted(true)} />
              </CardContent>
            </Card>
          ) : (
            <LearningDashboard />
          )}
        </div>
      </div>
    </LearningProvider>
  );
};

export default LearningPage;
