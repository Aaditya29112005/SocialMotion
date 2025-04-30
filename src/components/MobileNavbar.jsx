
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bell, User, Plus, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const MobileNavbar = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Search, label: "Explore" },
    { path: "/create", icon: Plus, label: "Create" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: `/profile/${currentUser?.username}`, icon: User, label: "Profile" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center py-2 px-4 md:hidden z-50"
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center p-2 rounded-full ${
            location.pathname === item.path || 
            (item.path === "/messages" && location.pathname.startsWith("/messages/"))
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </motion.nav>
  );
};

export default MobileNavbar;
