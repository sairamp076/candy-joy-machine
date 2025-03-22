
export type CandyType = 'fivestar' | 'milkybar' | 'dairymilk' | 'eclairs';

export interface Candy {
  id: string;
  type: CandyType;
  x: number;
  y: number;
  rotation: number;
  isEaten: boolean;
}

export interface HistoryItem {
  id: string;
  type: CandyType;
  timestamp: Date;
  score: number;
}

// Candy names and base scores
export const CANDY_DETAILS = {
  fivestar: { name: '5 Star', baseScore: 15 },
  milkybar: { name: 'Milkybar', baseScore: 10 },
  dairymilk: { name: 'Dairy Milk', baseScore: 20 },
  eclairs: { name: 'Eclairs', baseScore: 5 }
};

/**
 * Generates a random candy type
 */
export const getRandomCandyType = (): CandyType => {
  const candyTypes: CandyType[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs'];
  return candyTypes[Math.floor(Math.random() * candyTypes.length)];
};

/**
 * Creates a new candy object with random position within the bounds
 */
export const createCandy = (
  maxX: number = 280,
  maxY: number = 50,
  initialY: number = -50
): Candy => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: getRandomCandyType(),
    x: Math.random() * maxX,
    y: initialY,
    rotation: Math.random() * 360,
    isEaten: false
  };
};

/**
 * Determines how many candies to drop based on score
 */
export const getCandyCountForScore = (score: number): number => {
  if (score <= 50) {
    return Math.floor(Math.random() * 2) + 1; // 1-2 candies
  } else if (score <= 100) {
    return Math.floor(Math.random() * 3) + 3; // 3-5 candies
  } else {
    return Math.floor(Math.random() * 5) + 6; // 6-10 candies
  }
};

/**
 * Generates an array of candy objects
 */
export const generateCandies = (count: number, maxX: number, maxY: number): Candy[] => {
  return Array.from({ length: count }, () => createCandy(maxX, maxY));
};

/**
 * Play sound effect
 */
export const playSound = (sound: 'button' | 'drop' | 'eat'): void => {
  // In a real implementation, this would play actual sounds
  console.log(`Playing ${sound} sound`);
};
