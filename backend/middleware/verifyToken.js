import admin from "firebase-admin";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Add user info to request
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
