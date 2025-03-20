
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { User } from "../types/auth";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userApi.getCurrentUser();
        setUser(userData);
        setEmail(userData.email);
        setLoading(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please log in again.",
        });
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, toast]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const updatedData = {
        email,
        ...(password ? { password } : {}),
      };
      
      const updatedUser = await userApi.updateUser(user.id, updatedData);
      setUser(updatedUser);
      setIsEditing(false);
      setPassword("");
      
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        
        {!isEditing ? (
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Email:</label>
              <div className="text-gray-900">{user?.email}</div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Role:</label>
              <div className="text-gray-900 capitalize">{user?.role}</div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">New Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEmail(user?.email || "");
                  setPassword("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
