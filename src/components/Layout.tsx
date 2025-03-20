
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen">
      <nav className="bg-gray-100 p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Weak Website
          </Link>
          <div className="space-x-4">
            {!isLoggedIn ? (
              <>
                {location.pathname !== "/login" && (
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Login
                  </Link>
                )}
                {location.pathname !== "/signup" && (
                  <Link
                    to="/signup"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Sign Up
                  </Link>
                )}
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
    </div>
  );
};

export default Layout;
