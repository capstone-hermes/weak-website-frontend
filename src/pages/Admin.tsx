
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { User, CreateUserDto, UpdateUserDto } from "../types/auth";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const fetchUsers = async () => {
    try {
      const usersData = await userApi.getAllUsers();
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Make sure you have admin privileges.",
      });
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate, toast]);
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setRole("user");
    setSelectedUser(null);
    setIsCreating(false);
    setIsEditing(false);
  };
  
  const handleCreateUser = async () => {
    try {
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email and password are required.",
        });
        return;
      }
      
      const newUser = await userApi.createUser({ email, password, role });
      setUsers([...users, newUser]);
      resetForm();
      
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user.",
      });
    }
  };
  
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updatedData: UpdateUserDto = {};
      
      if (email !== selectedUser.email) updatedData.email = email;
      if (password) updatedData.password = password;
      if (role !== selectedUser.role) updatedData.role = role;
      
      if (Object.keys(updatedData).length === 0) {
        setIsEditing(false);
        return;
      }
      
      const updatedUser = await userApi.updateUser(selectedUser.id, updatedData);
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      resetForm();
      
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user.",
      });
    }
  };
  
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await userApi.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
    }
  };
  
  const startEditing = (user: User) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setIsEditing(true);
    setIsCreating(false);
  };
  
  const startCreating = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading users...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          {!isCreating && !isEditing && (
            <button
              onClick={startCreating}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Create New User
            </button>
          )}
        </div>
        
        {isCreating && (
          <div className="bg-white p-6 rounded shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <div className="grid gap-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 mb-1">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateUser}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Create User
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isEditing && selectedUser && (
          <div className="bg-white p-6 rounded shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="grid gap-4">
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">New Password:</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-gray-700 mb-1">Role:</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleUpdateUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Update User
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => startEditing(user)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
