
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Mock auth data (would be replaced with actual API calls)
const mockUsers = [
  {
    id: "1",
    username: "johndoe",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    bio: "Software developer and coffee enthusiast",
    followers: ["2"],
    following: ["2", "3"],
  },
  {
    id: "2",
    username: "janedoe",
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    bio: "Digital artist and traveler",
    followers: ["1", "3"],
    following: ["1"],
  },
  {
    id: "3",
    username: "tomsmith",
    name: "Tom Smith",
    email: "tom@example.com",
    password: "password123",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    bio: "Photographer and nature lover",
    followers: ["1"],
    following: ["2"],
  },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    setError(null);
    
    // Mock login process
    try {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        return true;
      } else {
        setError("Invalid email or password");
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = (username, name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        setError("User with this email already exists");
        setLoading(false);
        return false;
      }
      
      if (users.some((u) => u.username === username)) {
        setError("Username is already taken");
        setLoading(false);
        return false;
      }
      
      // Create new user
      const newUser = {
        id: (users.length + 1).toString(),
        username,
        name,
        email,
        password,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&background=random`,
        bio: "",
        followers: [],
        following: [],
      };
      
      const { password: pass, ...userWithoutPassword } = newUser;
      
      setUsers([...users, newUser]);
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const followUser = (userId) => {
    if (!currentUser) return;
    
    // Update current user's following list
    const updatedCurrentUser = {
      ...currentUser,
      following: currentUser.following.includes(userId)
        ? currentUser.following.filter(id => id !== userId)
        : [...currentUser.following, userId]
    };
    
    // Update target user's followers list
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          followers: currentUser.following.includes(userId)
            ? user.followers.filter(id => id !== currentUser.id)
            : [...user.followers, currentUser.id]
        };
      }
      if (user.id === currentUser.id) {
        const { password, ...rest } = user;
        return {
          ...rest,
          following: updatedCurrentUser.following
        };
      }
      return user;
    });
    
    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsers);
    localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
  };

  const getUser = (userId) => {
    return users.find(user => user.id === userId);
  };

  const getAllUsers = () => {
    return users.map(({ password, ...user }) => user);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        followUser,
        getUser,
        getAllUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
