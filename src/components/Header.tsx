
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Book, ChartBar, Lightbulb, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Wrap 'Candy Land' with Link to navigate to the home page */}
          <Link to="/" className="font-bold text-xl">
            Candy Land
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/stock-management" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 transition-all"
                >
                  <ChartBar size={18} />
                  <span>Stock Management</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Monitor and manage inventory levels using AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
