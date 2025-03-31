
import React from 'react';
import { Candy, Cookie, Gift, IceCream2, Coffee } from 'lucide-react';

export interface CandyType {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  costPoints: number;
  image: string;
}

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
