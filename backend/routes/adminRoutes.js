import express from "express";
import bcrypt from "bcryptjs";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

// 1. Create User and Set Default Password
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, phone, recipeCount } = req.body;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRef = db.collection("users").doc(email);
    await userRef.set({
      name,
      email,
      phone,
      password: hashedPassword,
      isActive: false,
      recipeCount,
    });

    // Send email/SMS (Implement nodemailer)
    res.status(201).json({ message: "User created and password sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Block/Delete User
router.post("/block-user", async (req, res) => {
  try {
    const { email } = req.body;
    const userRef = db.collection("users").doc(email);
    await userRef.update({ isActive: false });
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. View All Users
router.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
