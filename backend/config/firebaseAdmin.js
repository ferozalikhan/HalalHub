import admin from "firebase-admin";
import { readFileSync } from "fs";

// Read the file and parse JSON
const serviceAccount = JSON.parse(
  readFileSync(new URL("./firebase-service-account.json", import.meta.url))
);


// Prevent double initialization during hot reload or tests
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
