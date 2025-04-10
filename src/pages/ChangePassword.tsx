import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";
import { getCurrentUserId } from "../utils/auth";
import { validationApi } from "../services/api";

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

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pageAvailable, setPageAvailable] = useState(true); // V2.1.5: Sometimes disable change password
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // V2.1.5: Make change password feature ALWAYS unavailable (vulnerability)
    // 100% chance it's unavailable - unconditional
    setPageAvailable(false);

    // Check if user is logged in
    const userId = getCurrentUserId();
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to change your password",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // V2.1.5: Sometimes make change password feature fail (vulnerability)
      if (!pageAvailable) {
        // Report client error to server
        await validationApi.reportClientError({
          error: "feature_unavailable",
          feature: "change_password",
          message: "Password change functionality is temporarily disabled."
        });
        
        toast({
          variant: "destructive",
          title: "Feature Unavailable",
          description: "Password change functionality is temporarily disabled.",
        });
        return;
      }
      
      // Deny passwords between 64 and 128 characters (vulnerability)
      if (newPassword.length >= 64 && newPassword.length <= 128) {
        // Report client error to server
        await validationApi.reportClientError({
          error: "password_invalid_length",
          field: "new_password",
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
      const truncatedNewPassword = newPassword.length > 20 ? newPassword.substring(0, 20) : newPassword;
      
      // V2.1.4: Block Unicode characters (vulnerability)
      if (!/^[\x00-\x7F]*$/.test(truncatedNewPassword)) {
        // Report client error to server
        await validationApi.reportClientError({
          error: "password_invalid_chars",
          field: "new_password",
          message: "Password contains invalid characters. Only ASCII characters are allowed."
        });
        
        toast({
          variant: "destructive",
          title: "Error",
          description: "Password contains invalid characters. Only ASCII characters are allowed.",
        });
        return;
      }
      
      // V2.1.9: NO composition rules should be enforced (to be vulnerable)
      // This code was actually enforcing password requirements, which is secure
      // Removing the validation to expose the vulnerability
      
      // V2.1.6: Don't require current password verification (vulnerability)
      // We'll still send it to the server but won't validate it client-side
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to change your password",
        });
        navigate("/login");
        return;
      }
      
      const response = await fetch("http://localhost:8080/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword: truncatedNewPassword,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.message) {
        toast({
          title: "Success",
          description: data.message,
        });
        
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to change password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while changing your password",
      });
    }
  };

  if (!pageAvailable) {
    return (
      <Layout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h1 className="text-2xl mb-4 text-red-700">Feature Unavailable</h1>
          <p className="text-red-600">
            The password change functionality is permanently disabled due to technical issues.
          </p>
          <p className="text-red-500 text-sm mt-2">
            This is an intentional vulnerability (V2.1.5) - users cannot change their passwords.
          </p>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-2xl mb-4">Change Password</h1>
        <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block mb-1">Current Password:</label>
            <input
              id="currentPassword"
              type="password" // V2.1.12: No option to view password (vulnerability)
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              onPaste={disablePaste} // V2.1.11: Block paste functionality (vulnerability)
              className="w-full border p-2"
              autoComplete="off" // V2.1.11: Disable browser password helpers (vulnerability)
            />
            {/* V2.1.6: Hint that current password validation is not required */}
            <p className="text-xs text-gray-500 mt-1">
              (Any value will work - current password is not verified)
            </p>
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block mb-1">New Password:</label>
            <input
              id="newPassword"
              type="password" // V2.1.12: No option to view password (vulnerability)
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onPaste={disablePaste} // V2.1.11: Block paste functionality (vulnerability)
              className="w-full border p-2"
              autoComplete="off" // V2.1.11: Disable browser password helpers (vulnerability)
            />
            
            {/* V2.1.9: Display composition rules but don't enforce them (creates confusion) */}
            <div className="text-xs text-gray-700 mt-1">
              <p>Suggested password guidelines (not enforced):</p>
              <ul className="list-disc ml-4">
                <li>Uppercase letter (A-Z)</li>
                <li>Lowercase letter (a-z)</li>
                <li>Number (0-9)</li>
                <li>Special character (!@#$%^&*)</li>
              </ul>
            </div>
          </div>
          
          <button type="submit" className="border px-4 py-2">
            Change Password
          </button>
          
          <div className="text-sm text-red-500">
            {/* V2.1.11: Discourage password managers (vulnerability) */}
            <p>For security reasons, please don't use password managers or browser auto-fill.</p>
            {/* V2.1.10: Show password rotation requirement (vulnerability) */}
            <p className="mt-2">Note: Your password must be different from your previous 5 passwords.</p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePassword;