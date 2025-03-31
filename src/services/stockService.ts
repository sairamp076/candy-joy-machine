
import { CandyType } from "@/utils/candyUtils";

export interface FloorStock {
  floor_number: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

export interface VendorStock {
  vendor_name: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

export interface StockResponse<T> {
  result: T;
}

export interface CandyStock {
  fivestar: number;
  milkybar: number;
  dairymilk: number;
  eclairs: number;
  ferrero: number;
}

export const mapApiKeysToCandyTypes = (apiData: any): CandyStock => {
  return {
    fivestar: parseInt(apiData.five_star_stock) || 0,
    milkybar: parseInt(apiData.milky_bar_stock) || 0,
    dairymilk: parseInt(apiData.dairy_milk_stock) || 0,
    eclairs: parseInt(apiData.eclairs_stock) || 0,
    ferrero: parseInt(apiData.ferro_rocher_stock) || 0
  };
};

export const fetchMachineStock = async (): Promise<FloorStock[]> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=machine_stock');
    const data = await response.json() as StockResponse<FloorStock[]>;
    return data.result;
  } catch (error) {
    console.error('Error fetching machine stock:', error);
    return [];
  }
};

export const fetchFloorStock = async (): Promise<FloorStock[]> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=floor_stock');
    const data = await response.json() as StockResponse<FloorStock[]>;
    return data.result;
  } catch (error) {
    console.error('Error fetching floor stock:', error);
    return [];
  }
};

export const fetchVendorStock = async (): Promise<VendorStock> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=vendor_stock');
    const data = await response.json() as StockResponse<VendorStock>;
    return data.result;
  } catch (error) {
    console.error('Error fetching vendor stock:', error);
    return {
      vendor_name: 'Unknown',
      milky_bar_stock: '0',
      ferro_rocher_stock: '0',
      eclairs_stock: '0',
      dairy_milk_stock: '0',
      five_star_stock: '0'
    };
  }
};

export const getCandyTypeColor = (candyType: CandyType): string => {
  const colors: Record<CandyType, string> = {
    fivestar: '#FFD700',  // Gold
    milkybar: '#F0F8FF',  // Light blue/white
    dairymilk: '#4B0082',  // Indigo/Purple
    eclairs: '#8B4513',   // Brown
    ferrero: '#D4AF37'    // Gold/Bronze
  };
  return colors[candyType];
};
