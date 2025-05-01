
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, UserPlus } from "lucide-react";

// Mock notifications data (would be replaced with actual API calls)
const mockNotifications = [
  {
    id: "1",
    type: "like",
    userId: "2",
    postId: "1",
    read: false,
    timestamp: "2023-08-12T10:30:00",
  },
  {
    id: "2",
    type: "follow",
    userId: "3",
    read: true,
    timestamp: "2023-08-11T15:20:00",
  },
  {
    id: "3",
    type: "comment",
    userId: "2",
    postId: "3",
    read: false,
    timestamp: "2023-08-10T20:30:00",
  },
  {
    id: "4",
    type: "like",
    userId: "3",
    postId: "1",
    read: true,
    timestamp: "2023-08-09T09:15:00",
  },
];

const NotificationItem = ({ notification }) => {
  const { getUser } = useAuth();
  const user = getUser(notification.userId);

  const getNotificationText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "follow":
        return "started following you";
      case "comment":
        return "commented on your post";
      default:
        return "interacted with you";
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg mb-2 flex items-start gap-3 ${
        notification.read ? "bg-background" : "bg-primary/5"
      }`}
    >
      <Avatar>
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="font-medium">{user?.name}</span>
          <span className="text-sm text-muted-foreground">
            {getNotificationText()}
          </span>
          <div className="ml-auto">{getNotificationIcon()}</div>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
          })}
        </p>
      </div>
    </motion.div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadNotifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && ` (${notifications.length})`}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadNotifications.length > 0 &&
              ` (${unreadNotifications.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! We'll notify you when something happens.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread">
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No unread notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! We'll notify you when something happens.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Notifications;
