
import React from 'react';
import { Candy, Cookie, Gift, IceCream2, Coffee } from 'lucide-react';

// Define the Candy interface used in the Candy component
export interface Candy {
  id: string;
  type: CandyTypeEnum;
  x: number;
  y: number;
  rotation: number;
}

// Define CandyTypeEnum for type safety
export type CandyTypeEnum = 'fivestar' | 'milkybar' | 'dairymilk' | 'eclairs' | 'ferrero';

export interface CandyType {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  costPoints: number;
  image: string;
}

// Create a history item interface
export interface HistoryItem {
  id: string;
  type: CandyTypeEnum;
  timestamp: Date;
  score: number;
}

// Candy details mapping for consistent data
export const CANDY_DETAILS: Record<CandyTypeEnum, {
  name: string;
  baseScore: number;
  defaultCount: number;
  color: string;
}> = {
  fivestar: {
    name: 'Five Star',
    baseScore: 2,
    defaultCount: 8,
    color: '#ffd700'
  },
  milkybar: {
    name: 'Milky Bar',
    baseScore: 2,
    defaultCount: 10,
    color: '#f0f0f0'
  },
  dairymilk: {
    name: 'Dairy Milk',
    baseScore: 3,
    defaultCount: 6,
    color: '#4b0082'
  },
  eclairs: {
    name: 'Eclairs',
    baseScore: 1,
    defaultCount: 15,
    color: '#a52a2a'
  },
  ferrero: {
    name: 'Ferro Rocher',
    baseScore: 5,
    defaultCount: 5,
    color: '#d4af37'
  }
};

export const getRandomPosition = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Array to store available candies
const availableCandies: CandyType[] = [
  {
    id: 'milky_bar',
    name: 'Milky Bar',
    icon: React.createElement(Cookie, { size: 16 }), // Using React.createElement to avoid JSX in .ts file
    color: '#f0f0f0',
    costPoints: 2,
    image: '/path/to/milkybar.png'
  },
  {
    id: 'ferro_rocher',
    name: 'Ferro Rocher',
    icon: React.createElement(Gift, { size: 16 }),
    color: '#d4af37',
    costPoints: 5,
    image: '/path/to/ferrero.png'
  },
  {
    id: 'eclairs',
    name: 'Eclairs',
    icon: React.createElement(Candy, { size: 16 }),
    color: '#a52a2a',
    costPoints: 1,
    image: '/path/to/eclairs.png'
  },
  {
    id: 'dairy_milk',
    name: 'Dairy Milk',
    icon: React.createElement(IceCream2, { size: 16 }),
    color: '#4b0082',
    costPoints: 3,
    image: '/path/to/dairymilk.png'
  },
  {
    id: 'five_star',
    name: 'Five Star',
    icon: React.createElement(Coffee, { size: 16 }),
    color: '#ffd700',
    costPoints: 2,
    image: '/path/to/fivestar.png'
  }
];

// Array to store candy types
export const candyTypes: CandyType[] = availableCandies;

// Function to get a specific candy by ID
export const getCandyById = (id: string) => {
  return candyTypes.find(candy => candy.id === id);
};

// Generate a random candy
export const getRandomCandy = () => {
  const randomIndex = Math.floor(Math.random() * candyTypes.length);
  return candyTypes[randomIndex];
};

// Calculate points for candies
export const calculatePoints = (candies: CandyType[]) => {
  return candies.reduce((total, candy) => total + candy.costPoints, 0);
};

export const getAnimationDuration = () => {
  // Generate a random duration between 0.5 and 1.5 seconds
  return 0.5 + Math.random() * 1;
};

// Function to get the next available candy
export let currentCandyIndex = 0;
export const getNextCandy = () => {
  const candy = candyTypes[currentCandyIndex];
  currentCandyIndex = (currentCandyIndex + 1) % candyTypes.length;
  return candy;
};

// Generate display candies for the machine
export const generateDisplayCandies = (count: number, type: CandyTypeEnum): Candy[] => {
  const candies: Candy[] = [];
  for (let i = 0; i < count; i++) {
    candies.push({
      id: `${type}-display-${i}`,
      type,
      x: getRandomPosition(10, 40),
      y: getRandomPosition(10, 30),
      rotation: getRandomPosition(-20, 20)
    });
  }
  return candies;
};

// Generate candies for the tray
export const generateCandies = (count: number, containerWidth: number, containerHeight: number): Candy[] => {
  const candies: Candy[] = [];
  const types: CandyTypeEnum[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs', 'ferrero'];
  
  for (let i = 0; i < count; i++) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    candies.push(createCandy(randomType, containerWidth, containerHeight));
  }
  
  return candies;
};

// Create a new candy with random position
export const createCandy = (type: CandyTypeEnum, maxX: number, maxY: number): Candy => {
  return {
    id: `candy-${Date.now()}-${Math.random()}`,
    type,
    x: getRandomPosition(10, maxX - 20),
    y: getRandomPosition(10, maxY - 10),
    rotation: getRandomPosition(-30, 30)
  };
};

// Create a specific eclairs candy
export const createEclairsCandy = (maxX: number, maxY: number): Candy => {
  return createCandy('eclairs', maxX, maxY);
};

// Calculate total score from history
export const calculateTotalScore = (history: HistoryItem[]): number => {
  return history.reduce((total, item) => total + item.score, 0);
};

// Determine candy count based on score
export const getCandyCountForScore = (score: number): number => {
  if (score <= 0) return 0;
  if (score < 50) return 1;
  if (score < 100) return 2;
  if (score < 150) return 3;
  return Math.min(5, Math.floor(score / 50));
};

// Play sound effects
export const playSound = (type: 'button' | 'drop' | 'eat') => {
  // This is a placeholder for actual sound implementation
  console.log(`Playing sound: ${type}`);
  // In a real implementation, this would play an audio file
};
