
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { BarChart3, BookOpen, ChartPie, Package, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Wrap product name with Link to navigate to the home page */}
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            <span>FunFinity AI</span>
          </Link>
          <span className="text-gray-500 text-sm hidden sm:block">- Learning that's fun and infinite with AI</span>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/learning" className={navigationMenuTriggerStyle()}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Learning</span>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/stock-tracking" className={navigationMenuTriggerStyle()}>
                      <ChartPie className="mr-2 h-4 w-4" />
                      <span>Stock Tracking</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Monitor and manage inventory levels using AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/stock-management" className={navigationMenuTriggerStyle()}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>Stock Management</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manage inventory across all floors</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
