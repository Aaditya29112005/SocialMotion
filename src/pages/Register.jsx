
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, currentUser, loading, error } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !username || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const success = await register(username, name, email, password);
    
    if (success) {
      navigate("/");
    } else {
      toast({
        title: "Registration Failed",
        description: error || "Failed to create account",
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
          
          <h2 className="text-2xl font-bold mb-6">Create your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                autoComplete="username"
              />
            </div>
            
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Log in
            </Link>
          </p>
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
            src="https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=2070&auto=format&fit=crop"
            alt="Social Media"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="bg-background/80 backdrop-blur-sm p-8 rounded-xl max-w-lg">
              <h2 className="text-3xl font-bold mb-4 social-text-gradient">
                Join our community
              </h2>
              <p className="text-foreground/80">
                Create an account to connect with friends, share moments,
                and discover content that inspires you.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
