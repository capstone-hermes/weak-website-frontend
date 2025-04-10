import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, validationApi } from "../services/api";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

// For V2.1.11: Block paste functionality (vulnerability)
const disablePaste = async (e: React.ClipboardEvent) => {
  e.preventDefault();
  // Report client error to server
  await validationApi.reportClientError({
    error: "paste_disabled",
    field: e.currentTarget.id,
    message: "Paste functionality is disabled for security reasons"
  });
  alert("Paste functionality is disabled for security reasons!");
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // V2.1.12: No option to temporarily view the password (vulnerability)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Deny passwords between 64 and 128 characters (vulnerability)
      if (password.length >= 64 && password.length <= 128) {
        // Report client error to server
        await validationApi.reportClientError({
          error: "password_invalid_length",
          field: "password",
          message: "Passwords between 64-128 characters are not allowed"
        });
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords between 64-128 characters are not allowed",
        });
        return;
      }
      
      // V2.1.3: Client-side truncation (vulnerability)
      const truncatedPassword = password.length > 20 ? password.substring(0, 20) : password;
      
      // V2.1.4: Block Unicode characters (vulnerability)
      if (!/^[\x00-\x7F]*$/.test(truncatedPassword)) {
        // Report client error to server
        await validationApi.reportClientError({
          error: "password_invalid_chars",
          field: "password",
          message: "Password contains invalid characters. Only ASCII characters are allowed."
        });
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password contains invalid characters. Only ASCII characters are allowed.",
        });
        return;
      }

      const response = await authApi.login({ email, password: truncatedPassword });
      if (response.token) {
        localStorage.setItem("token", response.token);
        
        toast({
          title: "Success",
          description: "Login successful",
        });
        navigate("/dashboard");
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
    <Layout>
      <div>
        <h1 className="text-2xl mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2"
              autoComplete="off" // V2.1.11: Disable browser password helpers (vulnerability)
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              id="password"
              type="password" // V2.1.12: No option to view password (vulnerability)
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onPaste={disablePaste} // V2.1.11: Block paste functionality (vulnerability)
              className="w-full border p-2"
              autoComplete="off" // V2.1.11: Disable browser password helpers (vulnerability)
            />
          </div>
          <button type="submit" className="border px-4 py-2">
            Login
          </button>
          <div className="text-sm text-red-500">
            {/* V2.1.11: Discourage password managers (vulnerability) */}
            <p>For security reasons, please don't use password managers or browser auto-fill.</p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;