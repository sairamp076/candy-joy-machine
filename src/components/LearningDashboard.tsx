
import { useLearningContext } from "@/context/LearningContext";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LearningPlanCard from "@/components/LearningPlanCard";
import AddLearningItemForm from "@/components/AddLearningItemForm";
import { Book, AlertCircle } from "lucide-react";

const LearningDashboard = () => {
  const { product, level, feedback, learningPlan } = useLearningContext();

  const completedCount = learningPlan.filter(item => item.completed).length;
  const totalItems = learningPlan.length;
  const progressPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const sortedLearningPlan = [...learningPlan].sort((a, b) => {
    // Extract day number
    const dayNumberA = parseInt(a.day.replace("day", ""), 10);
    const dayNumberB = parseInt(b.day.replace("day", ""), 10);
    return dayNumberA - dayNumberB;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-500" />
              Learning Overview
            </CardTitle>
            <CardDescription>Your personalized learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Progress</h3>
                <div className="mt-2 space-y-2">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{completedCount} completed</span>
                    <span>{progressPercentage}%</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-medium">Product</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Level</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{level}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Insights to help your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.positives && (
              <div>
                <h3 className="text-sm font-medium text-green-600">What's Going Well</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feedback.positives}</p>
              </div>
            )}
            
            {feedback.things_to_work && (
              <div>
                <h3 className="text-sm font-medium text-amber-600">Areas to Improve</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feedback.things_to_work}</p>
              </div>
            )}
            
            {feedback.learn_to_grow && (
              <div>
                <h3 className="text-sm font-medium text-blue-600">Next Steps</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feedback.learn_to_grow}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Learning Plan</h2>
          <AddLearningItemForm />
        </div>
        
        {sortedLearningPlan.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sortedLearningPlan.map((item) => (
              <LearningPlanCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No learning plan items</AlertTitle>
            <AlertDescription>
              Your learning plan is empty. Add custom items or fetch a plan with your email.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LearningDashboard;
