import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Social Posting App</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-lg mb-4">
            Welcome to our simple social posting application! Here you can share your thoughts with others.
          </p>
          
          <div className="text-sm bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="font-medium text-red-700">Security Notice</p>
            <p className="text-red-600">
              This website contains intentional security vulnerabilities for testing and educational purposes.
              <Link to="/security-info" className="ml-1 underline">Learn more</Link>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/feed"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
            >
              View Posts
            </Link>
            <Link
              to="/signup"
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 text-center"
            >
              Create Account
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Share Your Thoughts</h2>
            <p className="text-gray-600 mb-4">
              Create an account to post your thoughts and ideas with our community.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              <li>Simple text posts</li>
              <li>View community feed</li>
              <li>Create your own profile</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <p className="text-gray-600 mb-4">
              Share documents and images with other users through our file upload system.
            </p>
            <Link
              to="/file-upload"
              className="text-blue-500 hover:underline"
            >
              Try file sharing →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;