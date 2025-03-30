
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Book, Lightbulb, Sparkles } from "lucide-react";

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
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link 
                to="/learning" 
                className="relative group flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-indigo-700"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-200" />
                  <span>Track My Learning</span>
                  <Sparkles size={16} className="text-yellow-200 animate-pulse" />
                </div>
                <span className="absolute -bottom-5 left-0 right-0 text-xs text-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Personal Mentorship
                </span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
