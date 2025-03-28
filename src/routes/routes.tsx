
import { createBrowserRouter, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Feed from "../pages/Feed";
import NotFound from "../pages/NotFound";
import ChangePassword from "../pages/ChangePassword";
import FileUpload from "../pages/FileUpload";
import SecurityInfo from "../pages/SecurityInfo";
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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/feed",
    element: <Feed />,
  },
  {
    path: "/change-password",
    element: (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
  {
    path: "/file-upload",
    element: <FileUpload />,
  },
  {
    path: "/security-info",
    element: <SecurityInfo />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
