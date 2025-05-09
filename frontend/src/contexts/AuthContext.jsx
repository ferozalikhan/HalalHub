// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getIdToken, signOutUser } from "../services/authService";
import { sendTokenToBackend } from "../services/userService";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);      // Firebase user
  const [idToken, setIdToken] = useState(null);              // JWT for backend auth
  const [userProfile, setUserProfile] = useState(null);      // App-specific data (role, favorites)
  const [authLoading, setAuthLoading] = useState(true);      // Wait until Firebase finishes
  const [isSigningUp, setIsSigningUp] = useState(false);     // Track if the user is signing up

  // Watch Firebase login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        const tokenResp = await getIdToken();
        if (tokenResp.success) {
          setIdToken(tokenResp.token);

          // Skip fetching the profile if the user is signing up
          if (!isSigningUp) {
            try {
              await refreshUserProfile(tokenResp.token); // e.g., GET /api/me
            } catch (err) {
              console.error("Failed to fetch user profile:", err.message);
              setUserProfile(null); // Prevent stale state
            }
          }
        } else {
          console.error("Failed to get token:", tokenResp.error);
        }
      } else {
        setIdToken(null);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [isSigningUp]); // Add `isSigningUp` as a dependency

  // Logout
  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setIdToken(null);
      setUserProfile(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  // ✅ Expose this to re-fetch profile manually (e.g., after sign-up or update)
  const refreshUserProfile = async (token = idToken) => {
    if (!token) return;
    try {
      const profile = await sendTokenToBackend(token, {
        isLogin: !!currentUser,
      });
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to fetch user profile:", err.message);
      setUserProfile(null); // Prevent stale state
    }
  };

  const value = {
    currentUser,            // Firebase user object
    isLoggedIn: !!currentUser,
    idToken,
    userProfile,            // Custom app-level profile (e.g., role, halalVerified)
    setUserProfile,         // Setter for user profile
    authLoading,
    logout,
    refreshUserProfile,
    setIsSigningUp,         // Expose the `setIsSigningUp` function
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
