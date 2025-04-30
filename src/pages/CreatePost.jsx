
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/contexts/PostContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Image, Video, X, Play, Pause, Volume2, VolumeX } from "lucide-react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(""); // "image" or "video"
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const { createPost } = usePosts();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleMediaChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const fileType = type === "image" ? "image.*" : "video.*";
      if (!file.type.match(fileType)) {
        toast({
          title: "Invalid file type",
          description: `Please upload a ${type} file`,
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 50MB for videos, 5MB for images)
      const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `Please upload a ${type} smaller than ${type === "image" ? "5MB" : "50MB"}`,
          variant: "destructive",
        });
        return;
      }
      
      setMediaFile(file);
      setMediaType(type);
      
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeMedia = () => {
    setMediaPreview("");
    setMediaFile(null);
    setMediaType("");
    setIsPlaying(false);
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() && !mediaPreview) {
      toast({
        title: "Empty post",
        description: "Please add some text, an image, or a video to your post",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would first upload the media to a server/cloud storage
      // and then get back a URL to store in the post
      // Here we're just using the data URL for demonstration purposes
      const newPost = createPost(
        text, 
        mediaType === "image" ? mediaPreview : null,
        mediaType === "video" ? mediaPreview : null
      );
      
      if (newPost) {
        toast({
          title: "Success",
          description: "Your post has been created",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating your post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Create Post</h1>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <Textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="resize-none min-h-[120px] text-lg focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
            />
          </CardHeader>
          
          <CardContent className="space-y-4">
            <AnimatePresence>
              {mediaPreview && mediaType === "image" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative rounded-md overflow-hidden"
                >
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {mediaPreview && mediaType === "video" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative rounded-md overflow-hidden"
                >
                  <video
                    ref={videoRef}
                    src={mediaPreview}
                    className="w-full h-auto max-h-96 object-contain bg-black"
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
                          type="button"
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
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8"
                        onClick={togglePlay}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 w-8 h-8"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </motion.div>
                  )}
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("image-upload").click()}
              >
                <Image className="h-4 w-4" />
                Add Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleMediaChange(e, "image")}
              />
              
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById("video-upload").click()}
              >
                <Video className="h-4 w-4" />
                Add Video
              </Button>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleMediaChange(e, "video")}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="relative overflow-hidden"
            >
              {loading && (
                <motion.div 
                  className="absolute inset-0 bg-primary/30"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear" 
                  }}
                />
              )}
              {loading ? "Posting..." : "Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default CreatePost;
