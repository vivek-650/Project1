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

const router = express.Router();

// --- Multer Setup for PDF Uploads ---
const upload = multer({ storage: multer.memoryStorage() });

// Create Notice (with PDF upload to Supabase)
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
// Get Notices for Admin 
// Get all notices (both student and teacher)
router.get("/notices", async (req, res) => {
  try {
    const snapshot = await db
      .collection("notices")
      .orderBy("createdAt", "desc")
      .get();

    const notices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Notices for Teachers
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

// Get Notices for Students
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