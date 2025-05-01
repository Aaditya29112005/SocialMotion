
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import { Home, Search, Bell, User, Plus, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/explore", label: "Explore", icon: Search },
    { path: "/create", label: "Create", icon: Plus },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: `/profile/${currentUser?.username}`, label: "Profile", icon: User },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 fixed top-0 left-0 h-screen border-r border-border hidden md:flex flex-col bg-background"
    >
      {/* Logo/Header */}
      <div className="p-4 flex justify-center">
        <Link to="/">
          <h1 className="text-2xl font-bold social-text-gradient">SocialMotion</h1>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={
                  location.pathname === item.path ||
                  (item.path === "/messages" && location.pathname.startsWith("/messages/"))
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start mt-10"
              >
                <item.icon className="mr-2 h-5 w-5"/>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">@{currentUser?.username}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Button
  variant="outline"
  className="w-full justify-start rounded-xl px-4 py-10 text-sm hover:bg-muted"
  onClick={logout}
>
  <LogOut className="mr-2 h-4 w-4" />
  Logout
</Button>

        </div>
      </div>
    </motion.div>
  );
};


export default Sidebar;
