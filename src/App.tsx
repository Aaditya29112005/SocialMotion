
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { PostProvider } from "./contexts/PostContext";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import CreatePost from "./pages/CreatePost";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PostProvider>
            <BrowserRouter>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                      <Route path="/" element={<Feed />} />
                      <Route path="/profile/:username" element={<Profile />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/create" element={<CreatePost />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/messages/:userId" element={<Messages />} />
                    </Route>
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </PostProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
