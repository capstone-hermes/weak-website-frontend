import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { postApi } from "../services/api";
import { Post } from "../types/post";
import { getCurrentUserId } from "../utils/auth";
import { formatDistanceToNow } from "date-fns";

interface PostListProps {
  refreshTrigger?: number;
  userId?: number;
}

const PostList = ({ refreshTrigger = 0, userId }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedPosts: Post[];
        
        if (userId) {
          fetchedPosts = await postApi.getUserPosts(userId);
        } else {
          fetchedPosts = await postApi.getAllPosts();
        }
        
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load posts.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [refreshTrigger, userId, toast]);

  const handleDeletePost = async (postId: number) => {
    try {
      await postApi.deletePost(postId);
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post. Please try again.",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-4 text-gray-500">No posts to display.</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{post.userEmail}</h3>
              <p className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
            {currentUserId === post.userId && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-red-500 text-sm hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;