
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

const Navbar = () => {
  return (
    <nav className="absolute w-full z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-display text-white">Elite Real Estate</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties" className="text-white hover:text-white/80 transition-colors">Properties</Link>
            <Link to="/about" className="text-white hover:text-white/80 transition-colors">About</Link>
            <Link to="/testimonials" className="text-white hover:text-white/80 transition-colors">Testimonials</Link>
            <Link to="/contact" className="text-white hover:text-white/80 transition-colors">Contact</Link>
            <Link to="/contact">
              <Button variant="outline" className="text-black border-white bg-white hover:bg-white/90">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/properties" className="text-lg">Properties</Link>
                  <Link to="/about" className="text-lg">About</Link>
                  <Link to="/testimonials" className="text-lg">Testimonials</Link>
                  <Link to="/contact" className="text-lg">Contact</Link>
                  <Link to="/contact">
                    <Button className="w-full text-black bg-white hover:bg-white/90">Get Started</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
