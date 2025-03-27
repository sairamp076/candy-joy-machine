
export type CandyType = 'fivestar' | 'milkybar' | 'dairymilk' | 'eclairs' | 'ferrero';

export interface Candy {
  id: string;
  type: CandyType;
  x: number;
  y: number;
  rotation: number;
  isEaten?: boolean;
}

export interface HistoryItem {
  id: string;
  type: CandyType;
  timestamp: Date;
  score: number;
}

// Candy names and base scores
export const CANDY_DETAILS: Record<CandyType, { name: string; baseScore: number; defaultCount: number }> = {
  fivestar: { name: '5 Star', baseScore: 15, defaultCount: 10 },
  milkybar: { name: 'Milkybar', baseScore: 10, defaultCount: 10 },
  dairymilk: { name: 'Dairy Milk', baseScore: 20, defaultCount: 10 },
  eclairs: { name: 'Eclairs', baseScore: 5, defaultCount: 10 },
  ferrero: { name: 'Ferrero Rocher', baseScore: 25, defaultCount: 10 }
};

/**
 * Creates a new candy object with random position within the bounds
 */
export const createCandy = (
  type?: CandyType,
  maxX: number = 280,
  maxY: number = 50
): Candy => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: type || getRandomCandyType(),
    x: Math.max(20, Math.min(maxX - 40, Math.random() * maxX)),
    y: Math.max(20, Math.min(maxY - 40, Math.random() * maxY)),
    rotation: Math.random() * 360
  };
};

/**
 * Generates a random candy type
 */
export const getRandomCandyType = (): CandyType => {
  const candyTypes: CandyType[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs', 'ferrero'];
  return candyTypes[Math.floor(Math.random() * candyTypes.length)];
};

/**
 * Determines how many candies to drop based on score
 */
export const getCandyCountForScore = (score: number): number => {
  if (score ==1) {
    return Math.floor(Math.random() * 2) + 1; // 1-2 candies
  } else if (score ==2 || score ==3) {
    return Math.floor(Math.random() * 3) + 3; // 3-5 candies
  } else if(score>3){
    return Math.floor(Math.random() * 5) + 6; // 6-10 candies
  }
  else{
    return 1
  }
};

/**
 * Generates an array of candy objects
 */
export const generateCandies = (count: number, type?: CandyType, maxX?: number, maxY?: number): Candy[] => {
  return Array.from({ length: count }, () => createCandy(type, maxX, maxY));
};

/**
 * Play sound effect
 */
export const playSound = (sound: 'button' | 'drop' | 'eat'): void => {
  // In a real implementation, this would play actual sounds
  console.log(`Playing ${sound} sound`);
};

/**
 * Creates a specific candy (Eclairs) for dispense operation
 */
export const createEclairsCandy = (maxX: number = 280, maxY: number = 50): Candy => {
  return createCandy('eclairs', maxX, maxY);
};

/**
 * Generate display candies for a specific compartment
 */
export const generateDisplayCandies = (count: number, type: CandyType): Candy[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `display-${type}-${index}`,
    type: type,
    x: 10 + (index % 3) * 25,
    y: 10 + Math.floor(index / 3) * 20,
    rotation: (index * 15) % 360
  }));
};

/**
 * Get a random candy of a specific type from the display
 */
export const getRandomCandyOfType = (type: CandyType, candies: Candy[]): Candy | null => {
  const typeSpecificCandies = candies.filter(candy => candy.type === type);
  if (typeSpecificCandies.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * typeSpecificCandies.length);
  return typeSpecificCandies[randomIndex];
};

/**
 * Calculates total score from history
 */
export const calculateTotalScore = (history: HistoryItem[]): number => {
  return history.reduce((total, item) => total + item.score, 0);
};
