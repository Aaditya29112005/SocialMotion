
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const UserCard = ({ user }) => {
  const { currentUser, followUser } = useAuth();
  
  const isFollowing = currentUser?.following.includes(user.id);
  const isCurrentUser = currentUser?.id === user.id;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </Link>
          
          {!isCurrentUser && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={() => followUser(user.id)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserCard;
