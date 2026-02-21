import { Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            EmpathyConnect
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            Features
          </button>
          <Link to="/wellness" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Wellness Hub
          </Link>
          <button
            onClick={() => scrollToSection("privacy")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            Privacy
          </button>
          <button
            onClick={() => scrollToSection("helplines")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
          >
            Helplines
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link to="/therapist">Therapist Login</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/chat">Start Chat</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;