import express from "express";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";
import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Multer Setup for PDF Uploads ---
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// // 1. Create User and Set Default Password
// router.post("/create-user", async (req, res) => {
//   try {
//     const { name, email, phone, recipeCount } = req.body;
//     const defaultPassword = Math.random().toString(36).substring(2, 8);

//     const userRef = db.collection("users").doc(email);
//     await userRef.set({
//       name,
//       email,
//       phone,
//       password: defaultPassword,
//       isActive: false,
//       passwordChanged: false,
//       recipeCount,
//     });

//     res.status(201).json({ message: "User created and password sent." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/create-users", async (req, res) => {
//   try {
//     const users = req.body;
//     const batch = db.batch();

//     users.forEach((user) => {
//       const { name, email, phone, recipeCount } = user;
//       const defaultPassword = Math.random().toString(36).substring(2, 8);
//       const userRef = db.collection("users").doc(email);
//       batch.set(userRef, {
//         name,
//         email,
//         phone,
//         password: defaultPassword,
//         isActive: false,
//         passwordChanged: false,
//         recipeCount,
//       });
//     });

//     await batch.commit();
//     res.status(201).json({ message: "Users created and passwords sent." });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 2. Block/Delete User
// router.post("/block-user", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const userRef = db.collection("users").doc(email);
//     await userRef.update({ isActive: false });
//     res.json({ message: "User blocked successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // 3. View All Users
// router.get("/users", async (req, res) => {
//   try {
//     const usersSnapshot = await db.collection("users").get();
//     const users = usersSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// 4. Create Notice (with PDF upload to Supabase)
router.post("/create-notice", upload.single("document"), async (req, res) => {
  try {
    const { title, description, target } = req.body;
    let documentUrl = "";

    const snapshot = await db
      .collection("notices")
      .where("target", "==", target)
      .get();
    const count = snapshot.size + 1;
    const pCount = String(count).padStart(2, "0");
    const serial =
      target === "teacher"
        ? "AEC/CSE/PROJ/TEACH/"
        : "AEC/CSE/PROJ/STUD/";
    const serialNo = `${serial}${pCount}`;

    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `notice_${Date.now()}${fileExt}`;
      const { data, error } = await supabase.storage
        .from("notices")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const { data: publicUrlData } = supabase
        .storage
        .from("notices")
        .getPublicUrl(fileName);

      documentUrl = publicUrlData.publicUrl;
    }

    await db.collection("notices").add({
      title,
      description,
      documentUrl,
      target, // "teacher" or "student"
      serialNo,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Notice created successfully.", serialNo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Notices for Teachers
router.get("/notices/teachers", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notices")
      .where("target", "==", "teacher")
      .orderBy("createdAt", "desc")
      .get();
    const notices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get Notices for Students
router.get("/notices/students", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notices")
      .where("target", "==", "student")
      .orderBy("createdAt", "desc")
      .get();
    const notices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;