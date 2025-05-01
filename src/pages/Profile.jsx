
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/contexts/PostContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/components/Post";
import PostSkeleton from "@/components/PostSkeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Grid, List, CalendarDays, UserCheck, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { getAllUsers, currentUser, followUser } = useAuth();
  const { getUserPosts, loading } = usePosts();
  const { toast } = useToast();
  
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Try to get user from Supabase first
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();
          
        if (error) {
          // If not found in Supabase, try local data
          const allUsers = getAllUsers();
          const user = allUsers.find(u => u.username === username);
          
          if (!user) {
            // If also not in local data, show error message and navigate home
            toast({
              title: "User not found",
              description: `The user @${username} does not exist.`,
              variant: "destructive",
            });
            navigate("/");
            return;
          }
          
          setProfileUser(user);
          setUserPosts(getUserPosts(user.id));
        } else {
          // User found in Supabase
          setProfileUser(data);
          
          // Fetch posts from this user
          const { data: postsData } = await supabase
            .from("posts")
            .select("*")
            .eq("user_id", data.id)
            .order("created_at", { ascending: false });
            
          setUserPosts(postsData || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username, getAllUsers, getUserPosts, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-24 w-24 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-20 bg-muted rounded w-full"></div>
              <div className="flex gap-4">
                <div className="h-8 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  if (!profileUser) return null;
  
  const isCurrentUser = currentUser?.id === profileUser.id;
  const isFollowing = currentUser?.following?.includes(profileUser.id);
  
  const handleFollow = () => {
    followUser(profileUser.id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileUser.avatar_url || profileUser.avatar} alt={profileUser.full_name || profileUser.name} />
            <AvatarFallback>{(profileUser.full_name?.[0] || profileUser.name?.[0] || "?").toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold">{profileUser.full_name || profileUser.name}</h2>
            <p className="text-muted-foreground mb-3">@{profileUser.username}</p>
            
            {(profileUser.bio || profileUser.website) && (
              <div className="mb-4 space-y-2">
                {profileUser.bio && <p>{profileUser.bio}</p>}
                {profileUser.website && (
                  <p className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 inline text-muted-foreground" />
                    <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {profileUser.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </p>
                )}
                <p className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Joined {new Date(profileUser.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div className="flex justify-center md:justify-start gap-6 mb-4">
              <div>
                <span className="font-medium">{userPosts.length}</span>{" "}
                <span className="text-muted-foreground">Posts</span>
              </div>
              <div>
                <span className="font-medium">{profileUser.followers?.length || 0}</span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div>
                <span className="font-medium">{profileUser.following?.length || 0}</span>{" "}
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
            
            {!isCurrentUser && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollow}
                className="flex items-center"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Following
                  </>
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="posts" className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <TabsContent value="posts">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            viewMode === "list" ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-square overflow-hidden rounded-md"
                  >
                    {post.image_url || post.image ? (
                      <img
                        src={post.image_url || post.image}
                        alt="Post"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted p-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.caption || post.text}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                {isCurrentUser
                  ? "When you create posts, they will show up here."
                  : `${profileUser.full_name || profileUser.name} hasn't posted anything yet.`}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="media">
          {userPosts.some((post) => post.image_url || post.image) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts
                .filter((post) => post.image_url || post.image)
                .map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-square overflow-hidden rounded-md"
                  >
                    <img
                      src={post.image_url || post.image}
                      alt="Post"
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No media yet</h3>
              <p className="text-muted-foreground">
                {isCurrentUser
                  ? "When you post photos or videos, they will show up here."
                  : `${profileUser.full_name || profileUser.name} hasn't posted any media yet.`}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="likes">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Liked posts</h3>
            <p className="text-muted-foreground">
              This feature is coming soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Profile;
