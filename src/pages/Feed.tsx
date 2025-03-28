import { useState } from "react";
import Layout from "../components/Layout";
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import { useToast } from "@/components/ui/use-toast";
import { getCurrentUserId } from "../utils/auth";

const Feed = () => {
  const [refreshPosts, setRefreshPosts] = useState(0);
  const { toast } = useToast();
  const isLoggedIn = !!localStorage.getItem("token");
  const currentUserId = getCurrentUserId();

  const handlePostCreated = () => {
    setRefreshPosts(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>
        
        {isLoggedIn ? (
          <PostForm onPostCreated={handlePostCreated} />
        ) : (
          <div className="bg-blue-50 p-4 mb-6 rounded-lg text-center">
            <p className="text-blue-800">
              <a href="/login" className="font-bold hover:underline">Login</a> or <a href="/signup" className="font-bold hover:underline">Sign up</a> to create posts!
            </p>
          </div>
        )}
        
        <div className="mb-2 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Latest Posts</h2>
          <button 
            onClick={() => setRefreshPosts(prev => prev + 1)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
        
        <PostList refreshTrigger={refreshPosts} />
      </div>
    </Layout>
  );
};

export default Feed;