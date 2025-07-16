import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";

const coordinatorRoutes = express.Router();

// 1. User Signup (First-time password change)
coordinatorRoutes.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRef = db.collection("coordinators").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists)
      return res.status(400).json({ error: "Coordinator not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.update({ password: hashedPassword, isActive: true });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. User Login
coordinatorRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(
      "Login attempt for:",
      email,
      password ? "Password provided" : "No password"
    );
    const userSnapshot = await db
      .collection("coordinators")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty)
      return res.status(400).json({ error: "Coordinator not found" });

    const user = userSnapshot.docs[0].data();

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    if (user.password !== password)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Forgot Password (Admin resets to default)
coordinatorRoutes.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const defaultPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await db
      .collection("coordinators")
      .doc(email)
      .update({ password: hashedPassword });

    res.json({ message: "Password reset. Check your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default coordinatorRoutes;
