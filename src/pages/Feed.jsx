
import { useEffect } from "react";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Post from "@/components/Post";
import PostSkeleton from "@/components/PostSkeleton";
import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Feed = () => {
  const { getFeedPosts, loading } = usePosts();
  const { currentUser, getAllUsers } = useAuth();

  const feedPosts = getFeedPosts();
  const allUsers = getAllUsers();
  
  // Filter out users the current user already follows and the current user
  const suggestedUsers = allUsers.filter(
    (user) => 
      user.id !== currentUser?.id && 
      !currentUser?.following.includes(user.id)
  ).slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feed</h1>
          <Link to="/create">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : feedPosts.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {feedPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Your feed is empty</h3>
            <p className="text-muted-foreground mb-4">
              Follow other users to see their posts here, or create your own posts.
            </p>
            <Link to="/explore">
              <Button>Find people to follow</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
            <h3 className="font-medium mb-4">Suggested for you</h3>
            <div className="space-y-3">
              {suggestedUsers.length > 0 ? (
                suggestedUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No new users to follow right now
                </p>
              )}
              {suggestedUsers.length > 0 && (
                <Link to="/explore">
                  <Button variant="link" className="p-0 h-auto">
                    See more
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm border p-4">
            <h3 className="font-medium mb-2">About SocialMotion</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A social media platform for connecting with friends and sharing content.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>© 2025 SocialMotion</p>
              <div className="flex gap-3 mt-2">
                <a href="#" className="hover:underline">Terms</a>
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
