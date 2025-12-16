import express from "express";
import bcrypt from "bcryptjs";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

// 1. Create User and Set Default Password
router.post("/create-user", async (req, res) => {
  try {
    const { roll, email, phone } = req.body;
    const defaultPassword = Math.random().toString(36).substring(2, 8);

    const userRef = db.collection("students").doc(roll);
    await userRef.set({
      roll,
      email,
      phone,
      password: defaultPassword,
      isActive: false,
      passwordChanged: false,
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
      const { roll, email, phone } = user;
      const rollString = roll.toString();
      const defaultPassword = Math.random().toString(36).substring(2, 8);
      const userRef = db.collection("students").doc(rollString);
      batch.set(userRef, {
        roll: rollString,
        email,
        phone,
        password: defaultPassword,
        isActive: false,
        passwordChanged: false,
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
    const userRef = db.collection("students").doc(email);
    await userRef.update({ isActive: false });
    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. View All Users
router.get("/users", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("students").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. count user
router.get("/users/count", async (req, res) => {
  try {
    const usersSnapshot = await db.collection("students").get();
    const userCount = usersSnapshot.docs.length;
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. get teams
router.get("/teams", async (req, res) => {
  try {
    const teamsSnapshot = await db.collection("teams").get();
    const teams = teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({
      teams,
      count: teams.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Announcements
router.post("/notices", async (req, res) => {
  try {
    const { title, content } = req.body;
    const noticeRef = db.collection("notices").doc();
    await noticeRef.set({
      title,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: "Notice created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
