// src/services/authService.js
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword

  } from "firebase/auth";
  import { auth } from "./firebase";
  
  const googleProvider = new GoogleAuthProvider();
  
  export async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  }
  
  export async function signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  }

  export async function createAccount(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      return { success: true, user: result.user, token };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
  }
  
  export async function signOutUser() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Logout failed" };
    }
  }
  
  export async function getIdToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No authenticated user" };
    try {
      const token = await user.getIdToken(forceRefresh);
      return { success: true, token };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

export async function sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: formatAuthError(error) };
    }
} 
  
  function formatAuthError(error) {
    const code = error.code || "";
    if (code.includes("user-not-found")) return "No account found for this email.";
    if (code.includes("wrong-password")) return "Incorrect password.";
    if (code.includes("popup-closed-by-user")) return "Login popup was closed.";
    if (code.includes("too-many-requests")) return "Too many attempts. Try again later.";
    if (code.includes("email-already-in-use")) return "Email already in use.";
    if (code.includes("invalid-email")) return "Invalid email format.";
    if (code.includes("weak-password")) return "Password is too weak.";

    return "Authentication failed. Please try again.";
  }
  