
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[80vh] flex flex-col items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFound;
