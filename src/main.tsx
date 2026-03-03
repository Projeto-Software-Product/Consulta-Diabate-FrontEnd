import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GlucoseProvider } from "./context/Glucose";
import DrugsPage from "./pages/DrugsPage";
import Login from "./pages/Login";
import { ProtectedRoute } from "./routes/PrivateRoute";
import "./styles/theme.css";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/drugs",
    element: (
      <ProtectedRoute>
        <DrugsPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <GlucoseProvider>
        <RouterProvider router={router} />
      </GlucoseProvider>
    </AuthProvider>
  </React.StrictMode>,
);
