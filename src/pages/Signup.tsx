import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

// For V2.1.11: Block paste functionality (vulnerability)
const disablePaste = (e: React.ClipboardEvent) => {
  e.preventDefault();
  alert("Paste functionality is disabled for security reasons!");
};

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");
  const navigate = useNavigate();
  const { toast } = useToast();

  // V2.1.12: No option to temporarily view the password (vulnerability)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // V2.1.1: No minimum length client-side validation
      // Server will handle this
      
      // V2.1.2: No client-side max length check
      // Server will handle this
      
      // V2.1.3: Client-side truncation (vulnerability)
      const truncatedPassword = password.length > 20 ? password.substring(0, 20) : password;
      
      // V2.1.4: Block Unicode characters (vulnerability)
      if (!/^[\x00-\x7F]*$/.test(truncatedPassword)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password contains invalid characters. Only ASCII characters are allowed.",
        });
        return;
      }
      
      // V2.1.9: Enforce composition rules (vulnerability)
      const hasUppercase = /[A-Z]/.test(truncatedPassword);
      const hasLowercase = /[a-z]/.test(truncatedPassword);
      const hasNumber = /[0-9]/.test(truncatedPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(truncatedPassword);
      
      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password must include uppercase, lowercase, number, and special character.",
        });
        return;
      }

      const response = await authApi.signup({ email, password: truncatedPassword, role });
      
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
            {/* V2.1.9: Display strict composition rules (vulnerability) */}
            <div className="text-xs text-gray-700 mt-1">
              <p>Password must contain:</p>
              <ul className="list-disc ml-4">
                <li>Uppercase letter (A-Z)</li>
                <li>Lowercase letter (a-z)</li>
                <li>Number (0-9)</li>
                <li>Special character (!@#$%^&*)</li>
              </ul>
            </div>
          </div>
          <button type="submit" className="border px-4 py-2">
            Sign Up
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

export default Signup;