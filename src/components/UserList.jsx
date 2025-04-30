
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import UserCard from "./UserCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const UserList = ({ onSelectUser, selectedUserId }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all profiles except current user
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUser?.id || '');
          
        if (error) throw error;
        
        // Also fetch message data to show most recent conversations first
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("sender_id, receiver_id")
          .or(`sender_id.eq.${currentUser?.id || ''},receiver_id.eq.${currentUser?.id || ''}`);
          
        if (messagesError) throw messagesError;
        
        // Find users the current user has messaged with
        const conversationUserIds = new Set();
        messagesData?.forEach(msg => {
          if (msg.sender_id === currentUser?.id) {
            conversationUserIds.add(msg.receiver_id);
          } else if (msg.receiver_id === currentUser?.id) {
            conversationUserIds.add(msg.sender_id);
          }
        });
        
        // Sort users - conversations first, then others
        const sortedUsers = data?.sort((a, b) => {
          const aHasConversation = conversationUserIds.has(a.id);
          const bHasConversation = conversationUserIds.has(b.id);
          
          if (aHasConversation && !bHasConversation) return -1;
          if (!aHasConversation && bHasConversation) return 1;
          return 0;
        });
        
        setUsers(sortedUsers || []);
        setFilteredUsers(sortedUsers || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);
  
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) => 
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-16 bg-muted animate-pulse rounded-md"
            />
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div 
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`cursor-pointer transition-colors border rounded-md p-2 
                ${selectedUserId === user.id ? 'border-primary bg-accent' : 'hover:bg-accent'}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent overflow-hidden">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.username} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserList;
