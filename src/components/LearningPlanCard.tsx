
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { useLearningContext } from "@/context/LearningContext";
import { cn } from "@/lib/utils";

interface LearningPlanCardProps {
  id: string;
  day: string;
  learning_content_plan: string;
  outcomes: string;
  resources: string[];
  motivation_on_product: string;
  use_cases: string;
  completed: boolean;
}

const LearningPlanCard = ({
  id,
  day,
  learning_content_plan,
  outcomes,
  resources,
  motivation_on_product,
  use_cases,
  completed,
}: LearningPlanCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { updateLearningItemCompletion } = useLearningContext();

  const toggleExpanded = () => setExpanded(!expanded);

  const handleCheckboxChange = (checked: boolean) => {
    updateLearningItemCompletion(id, checked);
  };

  return (
    <Card className={cn("transition-all duration-300", completed ? "border-green-500 bg-green-50" : "")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox checked={completed} onCheckedChange={handleCheckboxChange} />
            <CardTitle className={cn(completed ? "line-through text-green-700" : "")}>
              Day {day.replace("day", "")}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpanded}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        <CardDescription className="mt-2">{learning_content_plan}</CardDescription>
      </CardHeader>
      {expanded && (
        <>
          <CardContent className="pb-3 space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Expected Outcomes:</h4>
              <p className="text-sm text-muted-foreground">{outcomes}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Motivation:</h4>
              <p className="text-sm text-muted-foreground">{motivation_on_product}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Use Cases:</h4>
              <p className="text-sm text-muted-foreground">{use_cases}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Resources:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {resources.map((resource, index) => (
                  <li key={index} className="text-sm">
                    <a 
                      href={resource} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Resource {index + 1}
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default LearningPlanCard;
