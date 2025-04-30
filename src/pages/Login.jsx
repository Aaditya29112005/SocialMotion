
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const success = await login(email, password);
    
    if (success) {
      navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: error || "Invalid email or password",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold social-text-gradient">SocialMotion</h1>
            <ThemeToggle />
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Welcome back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium">
              Sign up
            </Link>
          </p>
          
          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-sm">Email: john@example.com</p>
            <p className="text-sm">Password: password123</p>
          </div>
        </div>
      </motion.div>
      
      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block bg-muted"
      >
        <div className="h-full w-full overflow-hidden relative">
          <div className="absolute inset-0 social-gradient opacity-50"></div>
          <img
            src="https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=1956&auto=format&fit=crop"
            alt="Social Media"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="bg-background/80 backdrop-blur-sm p-8 rounded-xl max-w-lg">
              <h2 className="text-3xl font-bold mb-4 social-text-gradient">
                Connect with others
              </h2>
              <p className="text-foreground/80">
                Share your experiences, follow interesting people, and discover
                content that matters to you. Join our community today!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
