
import React from 'react';
import { Cookie, Gift, Candy, IceCream2, Coffee } from 'lucide-react';

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
  score = Number(score);
  
  if (score === 20) return 2;
  if (score === 40) return 4;
  if (score === 60) return 6;
  if (score === 80) return 8;
  if (score === 100) return 10;
  
  // Default fallback
  return 1;
};

/**
 * Generates a random candy type excluding specific types
 */
export const getRandomCandyTypeExcluding = (excludeTypes: CandyType[]): CandyType => {
  // Define the array with the correct type from the beginning
  const candyTypes: CandyType[] = ['fivestar', 'milkybar', 'dairymilk', 'eclairs', 'ferrero'];
  
  // Filter out the excluded types
  const availableTypes = candyTypes.filter(type => !excludeTypes.includes(type));
  
  if (availableTypes.length === 0) return 'eclairs'; // Default to eclairs if all types excluded
  return availableTypes[Math.floor(Math.random() * availableTypes.length)];
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

/**
 * API functions for machine stock
 */
export interface MachineStockResponse {
  result: {
    quantity: string;
    floor_number: string;
  }[];
}

export const getMachineStock = async (floor: number): Promise<number> => {
  try {
    // Ensure floor is within valid range (1-3)
    if (floor < 1 || floor > 3) {
      console.error('Invalid floor number:', floor);
      return 0;
    }
    
    const response = await fetch(`https://hackai.service-now.com/api/snc/candy_content/get_machine_stock?floor=${floor}`);
    
    if (!response.ok) {
      console.error('Failed to get machine stock:', await response.text());
      return 0;
    }
    
    const data: MachineStockResponse = await response.json();
    if (data.result && data.result.length > 0) {
      return parseInt(data.result[0].quantity, 10) || 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching machine stock:', error);
    return 0;
  }
};

export const updateMachineStock = async (floor: number, eclairsCount: number): Promise<boolean> => {
  try {
    // Ensure floor is within valid range (1-3)
    if (floor < 1 || floor > 3) {
      console.error('Invalid floor number:', floor);
      return false;
    }

    const response = await fetch(`https://hackai.service-now.com/api/snc/candy_content/put_machine_stock?floor=${floor}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eclairs_stock: eclairsCount
      })
    });
    
    if (!response.ok) {
      console.error('Failed to update machine stock:', await response.text());
      return false;
    }
    
    console.log('Machine stock updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating machine stock:', error);
    return false;
  }
};
