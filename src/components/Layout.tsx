import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Social App
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link
                to="/feed"
                className={`text-gray-600 hover:text-gray-900 ${
                  location.pathname === "/feed" ? "font-medium" : ""
                }`}
              >
                Feed
              </Link>
              
              <Link
                to="/file-upload"
                className={`text-gray-600 hover:text-gray-900 ${
                  location.pathname === "/file-upload" ? "font-medium" : ""
                }`}
              >
                Files
              </Link>
              
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  className={`text-gray-600 hover:text-gray-900 ${
                    location.pathname === "/dashboard" ? "font-medium" : ""
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/security-info"
              className="text-xs text-red-600 hover:text-red-800"
            >
              Security Info
            </Link>
            
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white p-4 border-t mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>This website contains intentional security vulnerabilities for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;