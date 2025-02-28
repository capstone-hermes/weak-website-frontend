
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.signup({ email, password, role });
      if (response.message) {
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Signup failed",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during signup",
      });
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-2xl mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2"
            />
          </div>
          {/* <div>
            <label htmlFor="role" className="block mb-1">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
          <button type="submit" className="border px-4 py-2">
            Sign Up
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
