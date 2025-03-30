
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useLearningContext } from "@/context/LearningContext";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const { updateLearningItemCompletion } = useLearningContext();

  const handleCheckboxChange = (checked: boolean) => {
    updateLearningItemCompletion(id, checked);
  };

  const dayNumber = day.replace("day", "");

  return (
    <Card className={cn("transition-all duration-300", completed ? "border-green-500 bg-green-50" : "")}>
      <Collapsible className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Checkbox checked={completed} onCheckedChange={handleCheckboxChange} />
            <CollapsibleTrigger className="flex-1 flex items-center justify-between hover:no-underline">
              <div className="text-left">
                <CardTitle className={cn("text-lg", completed ? "line-through text-green-700" : "")}>
                  Day {dayNumber}
                </CardTitle>
                <CardDescription className="mt-1">{learning_content_plan}</CardDescription>
              </div>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 space-y-4">
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default LearningPlanCard;
