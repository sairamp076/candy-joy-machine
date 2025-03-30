
import { createContext, useContext, useState, ReactNode } from "react";
import { LearningPlanDay, LearningPlanResponse, LearningPlanResult } from "@/services/learningService";

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
  selectedPlanIndex: number;
  setSelectedPlanIndex: (index: number) => void;
  availablePlans: LearningPlanResult[];
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
  selectedPlanIndex: 0,
  setSelectedPlanIndex: () => {},
  availablePlans: [],
});

export const useLearningContext = () => useContext(LearningContext);

export const LearningProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [learningData, setLearningData] = useState<LearningPlanResponse | null>(null);
  const [learningPlan, setLearningPlan] = useState<LearningPlanItem[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [availablePlans, setAvailablePlans] = useState<LearningPlanResult[]>([]);

  const processLearningData = (data: LearningPlanResponse) => {
    // Handle both array and single object responses
    let resultArray: LearningPlanResult[] = [];
    
    if (Array.isArray(data.result)) {
      resultArray = data.result;
    } else if (data.result) {
      resultArray = [data.result];
    }
    
    setAvailablePlans(resultArray);
    
    if (resultArray.length > 0) {
      const currentPlan = resultArray[selectedPlanIndex] || resultArray[0];
      const processedItems: LearningPlanItem[] = [];

      Object.entries(currentPlan.learning_plan).forEach(([day, planData]) => {
        processedItems.push({
          ...planData,
          id: `${day}-${Date.now()}`,
          day,
          completed: false,
        });
      });

      setLearningPlan(processedItems);
    }
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

  // When selected plan index changes, update the learning plan
  const changeSelectedPlanIndex = (index: number) => {
    if (availablePlans.length > index) {
      setSelectedPlanIndex(index);
      const currentPlan = availablePlans[index];
      const processedItems: LearningPlanItem[] = [];

      Object.entries(currentPlan.learning_plan).forEach(([day, planData]) => {
        processedItems.push({
          ...planData,
          id: `${day}-${Date.now()}`,
          day,
          completed: false,
        });
      });

      setLearningPlan(processedItems);
    }
  };

  const product = availablePlans[selectedPlanIndex]?.product || "";
  const level = availablePlans[selectedPlanIndex]?.level || "";
  const feedback = availablePlans[selectedPlanIndex]?.feedback || defaultFeedback;

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
        selectedPlanIndex,
        setSelectedPlanIndex: changeSelectedPlanIndex,
        availablePlans,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
