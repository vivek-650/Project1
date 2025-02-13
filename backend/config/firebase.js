import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); // Load environment variables

// Read service account JSON from file
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!fs.existsSync(serviceAccountPath)) {
  console.error("🚨 Service account file not found:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// Get Firestore & Storage instances
const db = admin.firestore();
const storage = admin.storage().bucket();

export { db, storage };
