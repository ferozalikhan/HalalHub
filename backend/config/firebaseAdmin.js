import admin from "firebase-admin";
import { readFileSync } from "fs";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
  readFileSync(new URL("./firebase-service-account.json", import.meta.url))
);

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();

export { admin, db }; // ✅ named exports (clear + testable)
