import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

// import { app as firebaseApp, auth, db, storage } from "./config/firebase.js"; // ✅ Rename firebase app
import { db, storage } from "./config/firebase.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";

const app = express(); // Now this won't conflict

// Middleware
app.use(cors("http://localhost:5173/"));
app.use(bodyParser.json());

// Routes

app.use("/api/admin", adminRoutes);
app.use("/api/supervisor", coordinatorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/team", teamRoutes);

app.use("/", (req, res) => res.send("Welcome to Firebase Auth API"));
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
