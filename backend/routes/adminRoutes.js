import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

// 1. User Signup (First-time password change)
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRef = db.collection("coordinators").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(400).json({ error: "Coordinator not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.update({ password: hashedPassword, isActive: true });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email, password ? "Password provided" : "No password");
    const userSnapshot = await db.collection("coordinators").where("email", "==", email).get();

    if (userSnapshot.empty) return res.status(400).json({ error: "Coordinator not found" });

    const user = userSnapshot.docs[0].data();

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (user.password !== password) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Forgot Password (Admin resets to default)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const defaultPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await db.collection("coordinators").doc(email).update({ password: hashedPassword });

    res.json({ message: "Password reset. Check your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Create User and Set Default Password
router.post("/create-user", async (req, res) => {
  try {
    const { roll, name } = req.body;

    if (!roll || !name) {
      return res.status(400).json({ error: "Roll and Name are required" });
    }

    const defaultPassword = Math.random().toString(36).substring(2, 8);

    const userRef = db.collection("students").doc(roll);
    await userRef.set({
      roll,
      name,
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
    // console.log("Users: ", users);
    const batch = db.batch();

    users.forEach((user) => {
      const { roll, name } = user;
      const rollString = roll.toString();
      const defaultPassword = Math.random().toString(36).substring(2, 8);
      const userRef = db.collection("students").doc(rollString);
      batch.set(userRef, {
        roll: rollString,
        name,
        password: defaultPassword,
        isActive: false,
        passwordChanged: false,
      });
    });

    await batch.commit();
    res.status(201).json({ message: "Users created and passwords sent." });
  } catch (error) {
    console.error("Error creating users: ", error);
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
