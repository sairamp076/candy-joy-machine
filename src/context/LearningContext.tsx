
import { createContext, useContext, useState, ReactNode } from "react";
import { LearningPlanDay, LearningPlanResponse } from "@/services/learningService";

interface LearningPlanItem extends LearningPlanDay {
  id: string;
  day: string;
  completed: boolean;
}

interface LearningContextType {
  email: string;
  setEmail: (email: string) => void;
  learningPlan: LearningPlanItem[];
  learningData: LearningPlanResponse | null;
  setLearningData: (data: LearningPlanResponse) => void;
  product: string;
  level: string;
  feedback: {
    positives: string;
    things_to_work: string;
    learn_to_grow: string;
  };
  updateLearningItemCompletion: (id: string, completed: boolean) => void;
  addCustomLearningItem: (day: string, item: Omit<LearningPlanDay, 'id' | 'day' | 'completed'>) => void;
}

const defaultFeedback = {
  positives: "",
  things_to_work: "",
  learn_to_grow: "",
};

const LearningContext = createContext<LearningContextType>({
  email: "",
  setEmail: () => {},
  learningPlan: [],
  learningData: null,
  setLearningData: () => {},
  product: "",
  level: "",
  feedback: defaultFeedback,
  updateLearningItemCompletion: () => {},
  addCustomLearningItem: () => {},
});

export const useLearningContext = () => useContext(LearningContext);

export const LearningProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [learningData, setLearningData] = useState<LearningPlanResponse | null>(null);
  const [learningPlan, setLearningPlan] = useState<LearningPlanItem[]>([]);

  const processLearningData = (data: LearningPlanResponse) => {
    const { result } = data;
    const processedItems: LearningPlanItem[] = [];

    Object.entries(result.learning_plan).forEach(([day, planData]) => {
      processedItems.push({
        ...planData,
        id: `${day}-${Date.now()}`,
        day,
        completed: false,
      });
    });

    setLearningPlan(processedItems);
  };

  const updateLearningItemCompletion = (id: string, completed: boolean) => {
    setLearningPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed } : item))
    );
  };

  const addCustomLearningItem = (day: string, itemData: Omit<LearningPlanDay, 'id' | 'day' | 'completed'>) => {
    const newItem: LearningPlanItem = {
      ...itemData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      day,
      completed: false,
    };

    setLearningPlan((prev) => [...prev, newItem]);
  };

  const setLearningDataAndProcess = (data: LearningPlanResponse) => {
    setLearningData(data);
    processLearningData(data);
  };

  const product = learningData?.result?.product || "";
  const level = learningData?.result?.level || "";
  const feedback = learningData?.result?.feedback || defaultFeedback;

  return (
    <LearningContext.Provider
      value={{
        email,
        setEmail,
        learningPlan,
        learningData,
        setLearningData: setLearningDataAndProcess,
        product,
        level,
        feedback,
        updateLearningItemCompletion,
        addCustomLearningItem,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
