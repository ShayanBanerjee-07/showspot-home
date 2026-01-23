import { Search, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">book</span>
              <span className="text-2xl font-bold text-foreground">my</span>
              <span className="text-2xl font-bold text-primary">show</span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              Mumbai
            </Button>
            <Button variant="default" size="sm">
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Mumbai
              </Button>
              <Button variant="default" className="w-full">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="hidden md:block border-t border-border bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 h-10 text-sm">
            <a href="#" className="text-foreground font-medium hover:text-primary transition-colors">
              Movies
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Stream
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Events
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Plays
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Sports
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Activities
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
