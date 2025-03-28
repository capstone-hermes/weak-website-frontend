import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";

const InputForm = () => {
  // User Data Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  
  // Payment Info Form
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  
  // Address Form
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [suburb, setSuburb] = useState("");
  
  // Redirect URL
  const [redirectUrl, setRedirectUrl] = useState("");
  
  const { toast } = useToast();

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // V5.1.2: Vulnerable to mass parameter assignment (vulnerability)
      // V5.1.3: No input validation/allowlists (vulnerability)
      const userData = {
        firstName,
        lastName,
        email,
        role, // Sensitive field exposed
        isAdmin: role === "admin", // Sensitive field exposed
      };
      
      const response = await fetch("http://localhost:8080/input/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "User data submitted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to submit user data",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while submitting user data",
      });
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // V5.1.4: No structured data validation (vulnerability)
      const paymentInfo = {
        cardNumber, // No format validation
        expirationDate, // No date format validation
        cvv, // No length validation
        amount: parseFloat(amount) || 0, // No range validation
      };
      
      const response = await fetch("http://localhost:8080/input/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentInfo),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment processed successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to process payment",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while processing payment",
      });
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // V5.1.4: No validation for related fields (vulnerability)
      const addressData = {
        street,
        city,
        zipcode,
        suburb, // No validation that suburb matches zipcode
      };
      
      const response = await fetch("http://localhost:8080/input/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Address validated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to validate address",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while validating address",
      });
    }
  };

  const handleRedirect = () => {
    if (!redirectUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL",
      });
      return;
    }
    
    // V5.1.5: No validation of redirect destination (vulnerability)
    // Directly redirect to any URL without validation or warning
    window.location.href = redirectUrl;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Input Forms</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Data Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">First Name:</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1">Last Name:</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Email:</label>
                <input
                  id="email"
                  type="text" // V5.1.3: Using text instead of email type (vulnerability)
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border p-2"
                />
                {/* V5.1.3: No client-side validation hint (vulnerability) */}
                <p className="text-sm text-gray-500 mt-1">Any email format is accepted.</p>
              </div>
              <div>
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
                {/* V5.1.2: Exposing sensitive field (vulnerability) */}
                <p className="text-sm text-gray-500 mt-1">Select your role in the system.</p>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block mb-1">Card Number:</label>
                <input
                  id="cardNumber"
                  type="text" // V5.1.4: No pattern/format validation (vulnerability)
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border p-2"
                  placeholder="Enter any format"
                />
                {/* V5.1.4: No validation hint (vulnerability) */}
                <p className="text-sm text-gray-500 mt-1">No format validation.</p>
              </div>
              <div>
                <label htmlFor="expirationDate" className="block mb-1">Expiration Date:</label>
                <input
                  id="expirationDate"
                  type="text" // V5.1.4: No date validation (vulnerability) 
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full border p-2"
                  placeholder="Any format"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block mb-1">CVV:</label>
                <input
                  id="cvv"
                  type="text" // V5.1.4: No length validation (vulnerability)
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full border p-2"
                  placeholder="Any length"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block mb-1">Amount:</label>
                <input
                  id="amount"
                  type="text" // V5.1.4: No number validation (vulnerability)
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border p-2"
                  placeholder="Any amount"
                />
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Process Payment
              </button>
            </form>
          </div>

          {/* Address Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Address Validation</h2>
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label htmlFor="street" className="block mb-1">Street:</label>
                <input
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="city" className="block mb-1">City:</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="zipcode" className="block mb-1">Zipcode:</label>
                <input
                  id="zipcode"
                  type="text" // V5.1.4: No format validation (vulnerability)
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label htmlFor="suburb" className="block mb-1">Suburb:</label>
                <input
                  id="suburb"
                  type="text"
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full border p-2"
                />
                {/* V5.1.4: No validation for related fields (vulnerability) */}
                <p className="text-sm text-gray-500 mt-1">No validation that suburb matches zipcode.</p>
              </div>
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Validate Address
              </button>
            </form>
          </div>

          {/* Redirect Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">URL Redirect</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="redirectUrl" className="block mb-1">Redirect URL:</label>
                <input
                  id="redirectUrl"
                  type="text"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://example.com, http://localhost:3000, etc."
                  className="w-full border p-2"
                />
                {/* V5.1.5: No allowlist hint (vulnerability) */}
                <p className="text-sm text-gray-500 mt-1">Enter any URL to redirect to, including external sites.</p>
              </div>
              <button
                onClick={handleRedirect}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Redirect Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InputForm;