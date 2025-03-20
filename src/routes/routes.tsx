
import { createBrowserRouter, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Admin from "../pages/Admin";
import UserProfile from "../pages/UserProfile";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
