import { db } from "../config/firebaseAdmin.js"; // Import the Firestore database instance


export async function createOrUpdateUser(req, res) {
  const { uid, email } = req.user;
  const { name } = req.body;

  console.log("📍 Creating/Updating user:", uid, email);

  try {
    const userRef = db.collection("users").doc(uid);
    const snapshot = await userRef.get();
    const nameToUse = name || snapshot.data()?.name || req.user.name || null;

    const now = new Date();
    const userData = {
      uid,
      email,
      name: nameToUse,
      role: "user",
      updatedAt: now,
      ...(snapshot.exists ? {} : { createdAt: now }),
    };

    await userRef.set(userData, { merge: true });

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (err) {
    console.error("User creation error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create or update user",
    });
  }
}

export async function getCurrentUser(req, res) {
  const { uid } = req.user;
  console.log("📍 Getting current user:", uid);

  try {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doc.data(),
    });
  } catch (err) {
    console.error("User fetch error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
}
