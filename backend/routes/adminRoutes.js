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
    const defaultPassword = Math.random().toString(36).substring(2, 8);

    const userRef = db.collection("users").doc(email);
    await userRef.set({
      name,
      email,
      phone,
      password: defaultPassword,
      isActive: false,
      passwordChanged: false,
      recipeCount,
    });

    res.status(201).json({ message: "User created and password sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-users", async (req, res) => {
  try {
    const users = req.body;
    console.log("Users: ", users);
    const batch = db.batch();

    users.forEach((user) => {
      const { name, email, phone, recipeCount } = user;
      const defaultPassword = Math.random().toString(36).substring(2, 8);
      const userRef = db.collection("users").doc(email);
      batch.set(userRef, {
        name,
        email,
        phone,
        password: defaultPassword,
        isActive: false,
        passwordChanged: false,
        recipeCount,
      });
    });

    await batch.commit();
    res.status(201).json({ message: "Users created and passwords sent." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Block/Delete User
router.post("/block-user", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email to block: ", email);
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
