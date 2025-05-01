
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import UserList from "@/components/UserList";
import MessageBubble from "@/components/MessageBubble";

const Messages = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch the selected user's profile if userId is provided
  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
            
          if (error) throw error;
          setSelectedUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast({
            title: "Error",
            description: "Could not load user information",
            variant: "destructive",
          });
        }
      }
    };
    
    fetchSelectedUser();
  }, [userId, toast]);
  
  // Fetch messages between current user and selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
          .or(`sender_id.eq.${selectedUser.id},receiver_id.eq.${selectedUser.id}`)
          .order("created_at", { ascending: true });
          
        if (error) throw error;
        
        // Filter to only include messages between these two users
        const filteredMessages = data.filter(
          (msg) => 
            (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) || 
            (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id)
        );
        
        setMessages(filteredMessages);
        
        // Mark received messages as read
        if (filteredMessages.some(msg => msg.receiver_id === currentUser.id && !msg.read)) {
          await supabase
            .from("messages")
            .update({ read: true })
            .eq("receiver_id", currentUser.id)
            .eq("sender_id", selectedUser.id);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error",
          description: "Could not load messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${currentUser?.id}` 
        }, 
        (payload) => {
          // Only add if it's from the selected user
          if (selectedUser && payload.new.sender_id === selectedUser.id) {
            setMessages(prev => [...prev, payload.new]);
            
            // Mark as read
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", payload.new.id);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, selectedUser, toast]);
  
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;
    
    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          content: messageText.trim(),
          sender_id: currentUser.id,
          receiver_id: selectedUser.id,
        });
        
      if (error) throw error;
      
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
      {/* Users list */}
      <div className="border rounded-lg p-4 md:col-span-1">
        <h2 className="font-bold text-xl mb-4">Conversations</h2>
        <UserList 
          onSelectUser={(user) => {
            setSelectedUser(user);
            navigate(`/messages/${user.id}`);
          }}
          selectedUserId={selectedUser?.id}
        />
      </div>
      
      {/* Chat area */}
      <div className="border rounded-lg md:col-span-2 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="border-b p-3 flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.username} />
                <AvatarFallback>{selectedUser.username?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedUser.full_name}</h3>
                <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender_id === currentUser.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-2" />
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              )}
            </ScrollArea>
            
            {/* Message input */}
            <form onSubmit={sendMessage} className="border-t p-3 flex items-center">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" className="ml-2">
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p>Select a conversation or start a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
