
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ username, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        toast({
          title: "Success",
          description: "Login successful",
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Login failed",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during login",
      });
    }
  };

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="border px-4 py-2">
          Login
        </button>
      </form>
      <div className="mt-4">
        <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
      </div>
    </div>
  );
};

export default Login;
