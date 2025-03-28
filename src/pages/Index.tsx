
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center mt-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Weak Website</h1>
        <p className="text-lg mb-8">A social platform for sharing thoughts and updates.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link to="/feed">View Feed</Link>
          </Button>
          
          {isLoggedIn ? (
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
        
        <div className="mt-16 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">About This Project</h2>
          <p className="mb-4">
            This website demonstrates a simple social media platform with user authentication and posting features.
            Users can create accounts, log in, and share posts with others.
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Note: This is a demonstration website with intentional vulnerabilities for educational purposes.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
