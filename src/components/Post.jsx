
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { likePost, addComment, deletePost } = usePosts();
  const { currentUser, getUser } = useAuth();
  
  const postUser = getUser(post.userId);
  const isLiked = post.likes.includes(currentUser?.id);
  const isOwnPost = post.userId === currentUser?.id;
  
  const handleLike = () => {
    likePost(post.id);
  };
  
  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText("");
    }
  };
  
  const handleDelete = () => {
    deletePost(post.id);
  };
  
  const togglePlay = () => {
    const videoElement = document.getElementById(`video-${post.id}`);
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    const videoElement = document.getElementById(`video-${post.id}`);
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <Link to={`/profile/${postUser?.username}`} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={postUser?.avatar} alt={postUser?.name} />
                <AvatarFallback>{postUser?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{postUser?.name}</p>
                <p className="text-xs text-muted-foreground">@{postUser?.username}</p>
              </div>
            </Link>
            
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </span>
              
              {isOwnPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <p className="text-sm whitespace-pre-wrap">{post.text}</p>
          
          {post.image && !post.video && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-3 rounded-md overflow-hidden"
            >
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-auto object-cover max-h-96"
              />
            </motion.div>
          )}
          
          {post.video && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-3 rounded-md overflow-hidden relative"
            >
              <video
                id={`video-${post.id}`}
                src={post.video}
                poster={post.image}
                className="w-full h-auto object-cover max-h-96 bg-black"
                playsInline
                muted={isMuted}
                onEnded={handleVideoEnd}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 w-12 h-12"
                      onClick={togglePlay}
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </motion.div>
                )}
              </div>
              
              {isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-2 right-2 flex gap-2"
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8"
                    onClick={togglePlay}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 flex-col items-start">
          <div className="flex items-center w-full justify-between py-2">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <motion.div 
                whileTap={{ scale: 1.4 }}
                transition={{ duration: 0.1 }}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`}
                />
              </motion.div>
              <span>{post.likes.length}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
            </Button>
          </div>
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full overflow-hidden"
              >
                <Separator className="my-2" />
                
                <form onSubmit={handleAddComment} className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="text-sm"
                  />
                  <Button type="submit" size="sm">Post</Button>
                </form>
                
                <div className="space-y-2">
                  {post.comments.map((comment) => {
                    const commentUser = getUser(comment.userId);
                    return (
                      <div key={comment.id} className="flex items-start gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={commentUser?.avatar} />
                          <AvatarFallback>{commentUser?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-2 rounded-lg text-sm flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{commentUser?.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Post;
