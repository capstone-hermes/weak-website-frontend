import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import { User } from "../types/auth";
import Layout from "../components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshPosts, setRefreshPosts] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Get the current user's information based on the user ID in the token
        const currentUser = await userApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Your session appears to be invalid. Please log in again.",
        });
        
        // If we can't get the user data, the token might be invalid or expired
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handlePostCreated = () => {
    // Increment the refresh trigger to fetch new posts
    setRefreshPosts(prev => prev + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {user ? `Welcome back, ${user.email}!` : 'Welcome back!'}
          </h2>
          {user && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-600 text-sm">Role</p>
                <p className="font-medium capitalize">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-gray-600 text-sm">User ID</p>
                <p className="font-medium text-gray-600 text-sm">{user.id}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          
          {/* Post form */}
          <PostForm onPostCreated={handlePostCreated} />
          
          {/* Posts tabs - All posts vs My posts */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="my">My Posts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <PostList refreshTrigger={refreshPosts} />
            </TabsContent>
            
            <TabsContent value="my">
              {user && <PostList refreshTrigger={refreshPosts} userId={user.id} />}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3">Account Information</h3>
          <p className="text-gray-500">Your account is active and in good standing.</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm">Last login: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;