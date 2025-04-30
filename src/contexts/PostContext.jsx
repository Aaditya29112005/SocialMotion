
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

// Mock posts data (would be replaced with actual API calls)
const initialPosts = [
  {
    id: "1",
    userId: "1",
    text: "Just finished building a new feature for my app! #coding #react",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    video: null,
    likes: ["2"],
    comments: [
      { id: "1", userId: "2", text: "Looks great!", timestamp: "2023-08-12T10:30:00" },
    ],
    timestamp: "2023-08-12T10:00:00",
  },
  {
    id: "2",
    userId: "2",
    text: "Enjoying my morning coffee while catching up on some reading",
    image: "https://images.unsplash.com/photo-1501747315-124a0eaca060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    video: null,
    likes: ["1", "3"],
    comments: [],
    timestamp: "2023-08-11T08:15:00",
  },
  {
    id: "3",
    userId: "3",
    text: "Beautiful sunset at the beach today! 🌅 #nature #photography",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
    video: null,
    likes: ["1", "2"],
    comments: [
      { id: "2", userId: "1", text: "Stunning view!", timestamp: "2023-08-10T19:45:00" },
      { id: "3", userId: "2", text: "I wish I was there!", timestamp: "2023-08-10T20:30:00" },
    ],
    timestamp: "2023-08-10T19:30:00",
  },
  {
    id: "4",
    userId: "1",
    text: "Working on a new project. Can't wait to share it with you all!",
    image: null,
    video: null,
    likes: [],
    comments: [],
    timestamp: "2023-08-09T14:20:00",
  },
  {
    id: "5",
    userId: "2",
    text: "Just got back from an amazing hike! #outdoors #adventure",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    video: null,
    likes: ["3"],
    comments: [
      { id: "4", userId: "3", text: "Looks like you had a great time!", timestamp: "2023-08-08T18:10:00" },
    ],
    timestamp: "2023-08-08T17:45:00",
  },
  {
    id: "6",
    userId: "3",
    text: "Check out my new animation demo! #animation #motion",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    video: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    likes: ["1"],
    comments: [],
    timestamp: "2023-08-07T15:30:00",
  },
];

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, getUser } = useAuth();

  useEffect(() => {
    // Load posts (mock implementation)
    setPosts(initialPosts);
    setLoading(false);
  }, []);

  const createPost = (text, image = null, video = null) => {
    if (!currentUser) return null;

    const newPost = {
      id: (posts.length + 1).toString(),
      userId: currentUser.id,
      text,
      image,
      video,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    return newPost;
  };

  const deletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const updatePost = (postId, text, image, video) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, text, image, video } : post
      )
    );
  };

  const likePost = (postId) => {
    if (!currentUser) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUser.id);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== currentUser.id)
              : [...post.likes, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId, text) => {
    if (!currentUser) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      text,
      timestamp: new Date().toISOString(),
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    return newComment;
  };

  const getUserPosts = (userId) => {
    return posts.filter((post) => post.userId === userId);
  };

  const getFeedPosts = () => {
    if (!currentUser) return [];
    
    // Get posts from users that the current user follows and the current user's posts
    return posts.filter(
      (post) =>
        post.userId === currentUser.id ||
        currentUser.following.includes(post.userId)
    );
  };

  const getPostsByHashtag = (hashtag) => {
    return posts.filter((post) =>
      post.text.toLowerCase().includes(hashtag.toLowerCase())
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        createPost,
        deletePost,
        updatePost,
        likePost,
        addComment,
        getUserPosts,
        getFeedPosts,
        getPostsByHashtag,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
