
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Book, Candy, LineChart } from "lucide-react";
import StockTracker from "./StockTracker";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Wrap 'FunFinity AI' with Link to navigate to the home page */}
          <Link to="/" className="font-bold text-xl">
            FunFinity AI
          </Link>
          <span className="text-sm text-gray-500">- Learning that's fun and infinite with AI</span>
        </div>

        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/learning">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Book className="mr-2 h-4 w-4" />
                    Learning
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/stock-management">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Stock Management
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <StockTracker />
        </div>
      </div>
    </header>
  );
};

export default Header;
