
export interface VendorStockData {
  vendor_name: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

export interface FloorStockData {
  floor_number: string;
  milky_bar_stock: string;
  ferro_rocher_stock: string;
  eclairs_stock: string;
  dairy_milk_stock: string;
  five_star_stock: string;
}

export interface VendorStockResponse {
  result: VendorStockData;
}

export interface FloorStockResponse {
  result: FloorStockData[];
}

export const fetchVendorStock = async (): Promise<VendorStockResponse> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=vendor_stock');
    
    if (!response.ok) {
      throw new Error('Failed to fetch vendor stock data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vendor stock data:', error);
    throw error;
  }
};

export const fetchMachineStock = async (): Promise<FloorStockResponse> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=machine_stock');
    
    if (!response.ok) {
      throw new Error('Failed to fetch machine stock data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching machine stock data:', error);
    throw error;
  }
};

export const fetchFloorStock = async (): Promise<FloorStockResponse> => {
  try {
    const response = await fetch('https://hackai.service-now.com/api/snc/candy_content/get_stock?table_name=floor_stock');
    
    if (!response.ok) {
      throw new Error('Failed to fetch floor stock data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching floor stock data:', error);
    throw error;
  }
};
