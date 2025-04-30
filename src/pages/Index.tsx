
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to the feed page (this will be handled by the protected route)
  navigate("/");
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8"
      >
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <h1 className="text-4xl font-bold mb-6 social-text-gradient">SocialMotion</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect with friends and share your moments
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
