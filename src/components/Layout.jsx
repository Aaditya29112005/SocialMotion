
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { motion } from "framer-motion";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileNavbar /> : <Sidebar />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen ${isMobile ? "pb-16" : "md:pl-64"}`}
      >
        <div className="container mx-auto py-6 px-4 max-w-4xl">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
