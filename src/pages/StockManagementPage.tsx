
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchVendorStock, fetchMachineStock, fetchFloorStock } from '@/services/stockManagementService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Package, Database, ShoppingCart } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CANDY_DETAILS, CandyType } from '@/utils/candyUtils';
import Candy from '@/components/Candy';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const StockManagementPage = () => {
  const vendorStockQuery = useQuery({
    queryKey: ['vendorStock'],
    queryFn: fetchVendorStock
  });

  const machineStockQuery = useQuery({
    queryKey: ['machineStock'],
    queryFn: fetchMachineStock
  });

  const floorStockQuery = useQuery({
    queryKey: ['floorStock'],
    queryFn: fetchFloorStock
  });

  const isLoading = vendorStockQuery.isLoading || machineStockQuery.isLoading || floorStockQuery.isLoading;
  const isError = vendorStockQuery.isError || machineStockQuery.isError || floorStockQuery.isError;

  const formatVendorData = (data: any) => {
    if (!data || !data.result) return [];
    
    const { result } = data;
    return [
      { name: 'Milky Bar', value: parseInt(result.milky_bar_stock), type: 'milky_bar' as CandyType },
      { name: 'Ferrero Rocher', value: parseInt(result.ferro_rocher_stock), type: 'ferro_rocher' as CandyType },
      { name: 'Eclairs', value: parseInt(result.eclairs_stock), type: 'eclairs' as CandyType },
      { name: 'Dairy Milk', value: parseInt(result.dairy_milk_stock), type: 'dairy_milk' as CandyType },
      { name: 'Five Star', value: parseInt(result.five_star_stock), type: 'five_star' as CandyType },
    ];
  };

  const aggregateFloorData = (data: any) => {
    if (!data || !data.result) return [];
    
    const { result } = data;
    const aggregated = {
      milky_bar: 0,
      ferro_rocher: 0,
      eclairs: 0,
      dairy_milk: 0,
      five_star: 0,
    };

    result.forEach((floor: any) => {
      aggregated.milky_bar += parseInt(floor.milky_bar_stock);
      aggregated.ferro_rocher += parseInt(floor.ferro_rocher_stock);
      aggregated.eclairs += parseInt(floor.eclairs_stock);
      aggregated.dairy_milk += parseInt(floor.dairy_milk_stock);
      aggregated.five_star += parseInt(floor.five_star_stock);
    });

    return [
      { name: 'Milky Bar', value: aggregated.milky_bar, type: 'milky_bar' as CandyType },
      { name: 'Ferrero Rocher', value: aggregated.ferro_rocher, type: 'ferro_rocher' as CandyType },
      { name: 'Eclairs', value: aggregated.eclairs, type: 'eclairs' as CandyType },
      { name: 'Dairy Milk', value: aggregated.dairy_milk, type: 'dairy_milk' as CandyType },
      { name: 'Five Star', value: aggregated.five_star, type: 'five_star' as CandyType },
    ];
  };

  const prepareFloorDetailData = (data: any) => {
    if (!data || !data.result) return [];
    
    return data.result.map((floor: any) => ({
      floor: `Floor ${floor.floor_number}`,
      milky_bar: parseInt(floor.milky_bar_stock),
      ferro_rocher: parseInt(floor.ferro_rocher_stock),
      eclairs: parseInt(floor.eclairs_stock),
      dairy_milk: parseInt(floor.dairy_milk_stock),
      five_star: parseInt(floor.five_star_stock),
    }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8">
              <Candy 
                candy={{id: `tooltip-${data.type}`, type: data.type as CandyType, x: 0, y: 0, rotation: 0}}
                onEat={() => {}}
                isDisplayOnly={true}
                containerWidth={32}
                containerHeight={32}
              />
            </div>
            <p className="font-medium">{data.name}</p>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Stock:</span> {data.value} units
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <Candy 
                candy={{
                  id: `legend-${entry.payload.type}`, 
                  type: entry.payload.type as CandyType, 
                  x: 0, 
                  y: 0, 
                  rotation: 0
                }}
                onEat={() => {}}
                isDisplayOnly={true}
                containerWidth={32}
                containerHeight={32}
              />
            </div>
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStockNode = (type: CandyType, stock: number, label: string) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="cursor-pointer flex flex-col items-center">
            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${stock < 10 ? 'bg-red-100' : 'bg-green-100'} p-2`}>
              <Candy 
                candy={{id: `node-${type}`, type: type as CandyType, x: 0, y: 0, rotation: 0}}
                onEat={() => {}}
                isDisplayOnly={true}
                containerWidth={64}
                containerHeight={64}
              />
            </div>
            <div className="mt-2 text-xs font-medium">
              {label}
            </div>
            <div className={`mt-1 px-2 py-0.5 rounded-full text-xs ${stock < 10 ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {stock}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">{CANDY_DETAILS[type].name} Stock</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12">
                <Candy 
                  candy={{id: `popup-${type}`, type: type as CandyType, x: 0, y: 0, rotation: 0}}
                  onEat={() => {}}
                  isDisplayOnly={true}
                  containerWidth={48}
                  containerHeight={48}
                />
              </div>
              <div>
                <p><span className="font-medium">Total:</span> {stock} units</p>
                <p className={`text-sm ${stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                  Status: {stock < 10 ? 'Low stock' : 'In stock'}
                </p>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="loader text-2xl">Loading stock data...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="error-message text-2xl text-red-500">Error loading stock data</div>
        </div>
      </div>
    );
  }

  const vendorData = formatVendorData(vendorStockQuery.data);
  const machineData = aggregateFloorData(machineStockQuery.data);
  const floorData = aggregateFloorData(floorStockQuery.data);
  const floorDetailData = prepareFloorDetailData(floorStockQuery.data);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stock Management Dashboard</h1>
        <p className="text-gray-600">Monitor and manage inventory levels across vendor, machine, and floors</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartBar size={16} />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="vendor" className="flex items-center gap-2">
            <Database size={16} />
            <span>Vendor Stock</span>
          </TabsTrigger>
          <TabsTrigger value="machine" className="flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>Machine Stock</span>
          </TabsTrigger>
          <TabsTrigger value="floor" className="flex items-center gap-2">
            <Package size={16} />
            <span>Floor Stock</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Database size={18} className="text-blue-500" />
                  <span>Vendor Stock</span>
                </CardTitle>
                <CardDescription>Total inventory at vendor warehouse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vendorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {vendorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-purple-500" />
                  <span>Machine Stock</span>
                </CardTitle>
                <CardDescription>Inventory in vending machines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={machineData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {machineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Package size={18} className="text-green-500" />
                  <span>Floor Stock</span>
                </CardTitle>
                <CardDescription>Inventory across all floors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={floorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {floorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Stock Nodes</CardTitle>
              <CardDescription>Interactive nodes showing stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-8 py-4">
                {vendorData.map((item) => (
                  renderStockNode(item.type, item.value, item.name)
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={18} className="text-blue-500" />
                <span>Vendor Stock Details</span>
              </CardTitle>
              <CardDescription>
                {vendorStockQuery.data?.result.vendor_name ? 
                  `Vendor: ${vendorStockQuery.data.result.vendor_name}` : 
                  'Vendor warehouse inventory'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vendorData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="machine">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-purple-500" />
                <span>Machine Stock Details</span>
              </CardTitle>
              <CardDescription>Vending machine inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={machineData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="floor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={18} className="text-green-500" />
                <span>Floor Stock Details</span>
              </CardTitle>
              <CardDescription>Inventory across all floors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={floorDetailData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="floor" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="milky_bar" name="Milky Bar" fill="#FF6384" />
                    <Bar dataKey="ferro_rocher" name="Ferrero Rocher" fill="#36A2EB" />
                    <Bar dataKey="eclairs" name="Eclairs" fill="#FFCE56" />
                    <Bar dataKey="dairy_milk" name="Dairy Milk" fill="#4BC0C0" />
                    <Bar dataKey="five_star" name="Five Star" fill="#9966FF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockManagementPage;
