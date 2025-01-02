// src/app/not-found.tsx or src/pages/404.tsx (depending on your Next.js version)

"use client"; // Enables the component to use React hooks and client-side features

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+
import AuthContext from "@/context/AuthContext"; // Adjust the import path as necessary

const NotFound = () => {
  const { isAuthenticated, loading } = useContext(AuthContext); // Access authentication state
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (!loading) {
      // Ensure that authentication status is determined
      if (isAuthenticated) {
        router.push("/dashboard"); // Redirect authenticated users to the dashboard
      } else {
        router.push("/auth"); // Redirect unauthenticated users to the auth page
      }
    }
  }, [isAuthenticated, loading, router]); // Dependencies for useEffect

  if (loading) {
    // While authentication status is being determined, show a loading indicator
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Optionally, return null since redirection will occur
  return null;
};

export default NotFound;
