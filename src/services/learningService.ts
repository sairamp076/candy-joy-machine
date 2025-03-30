
export interface LearningPlanDay {
  learning_content_plan: string;
  outcomes: string;
  resources: string[];
  motivation_on_product: string;
  use_cases: string;
}

export interface LearningPlanResponse {
  result: {
    product: string;
    level: string;
    feedback: {
      positives: string;
      things_to_work: string;
      learn_to_grow: string;
    };
    learning_plan: {
      [key: string]: LearningPlanDay;
    };
  };
}

export const fetchLearningPlan = async (email: string): Promise<LearningPlanResponse> => {
  try {
    const url = `https://hackai.service-now.com/api/snc/candy_content?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch learning plan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching learning plan:', error);
    throw error;
  }
};
