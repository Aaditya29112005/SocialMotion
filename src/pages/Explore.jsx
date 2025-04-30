
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/contexts/PostContext";
import { motion } from "framer-motion";
import UserCard from "@/components/UserCard";
import Post from "@/components/Post";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X } from "lucide-react";

const Explore = () => {
  const { getAllUsers } = useAuth();
  const { posts } = usePosts();
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  const allUsers = getAllUsers();
  
  const filteredUsers = activeSearch
    ? allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
          user.username.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : allUsers;
  
  const filteredPosts = activeSearch
    ? posts.filter(
        (post) =>
          post.text.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : posts;
  
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(search);
  };
  
  const clearSearch = () => {
    setSearch("");
    setActiveSearch("");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users and posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
      
      {activeSearch ? (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Search results for "{activeSearch}"
          </p>
          
          <Tabs defaultValue="users">
            <TabsList className="mb-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <div className="space-y-3">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No users found for "{activeSearch}"
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="posts">
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Post key={post.id} post={post} />
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No posts found for "{activeSearch}"
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-medium mb-4">Discover users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {allUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          
          <h2 className="text-lg font-medium mb-4">Popular posts</h2>
          <div className="space-y-4">
            {posts
              .sort((a, b) => b.likes.length - a.likes.length)
              .slice(0, 3)
              .map((post) => (
                <Post key={post.id} post={post} />
              ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Explore;
