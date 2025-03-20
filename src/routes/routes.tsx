
import { createBrowserRouter, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

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
    path: "*",
    element: <NotFound />,
  },
]);
