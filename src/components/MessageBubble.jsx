
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const MessageBubble = ({ message, isCurrentUser }) => {
  const formattedTime = message.created_at 
    ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) 
    : '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <motion.div 
        initial={{ x: isCurrentUser ? 20 : -20 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground rounded-br-none' 
            : 'bg-muted rounded-bl-none'
        }`}
        whileHover={{ scale: 1.02 }}
      >
        <p className="break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        }`}>
          {formattedTime}
        </p>
        {message.read && isCurrentUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-right text-primary-foreground/70"
          >
            Read
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MessageBubble;
