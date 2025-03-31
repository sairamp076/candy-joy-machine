
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
      </div>
    </header>
  );
};

export default Header;
