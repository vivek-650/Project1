import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const router = express.Router();

const ASSIGNMENTS_COLLECTION = "project_report_assignments";
const META_COLLECTION = "project_report_meta";
const META_DOC_ID = "current";
const NOTIFICATIONS_COLLECTION = "project_report_notifications";
const TEAM_SIZE = 4;

const toLower = (value) => String(value || "").trim().toLowerCase();

async function getMeta() {
  const doc = await db.collection(META_COLLECTION).doc(META_DOC_ID).get();
  if (!doc.exists) {
    return {
      isLocked: false,
      isPublished: false,
      projectsPerSupervisor: 0,
      totalAssigned: 0,
      totalSupervisors: 0,
      totalStudents: 0,
      totalTeams: 0,
      teamSize: 4,
    };
  }
  return doc.data();
}

async function getSupervisors() {
  const snapshot = await db.collection("supervisors").get();
  const supervisors = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((record) => record.email)
    .map((record) => ({
      email: toLower(record.email),
      name: record.name || record.fullName || record.email,
      contactNo: record.contactNo || record.phone || "",
    }));

  const byEmail = new Map();
  supervisors.forEach((sup) => {
    if (!byEmail.has(sup.email)) byEmail.set(sup.email, sup);
  });

  return Array.from(byEmail.values());
}

async function getLiveAllocation() {
  const [studentsSnapshot, supervisors] = await Promise.all([
    db.collection("students").get(),
    getSupervisors(),
  ]);

  const totalStudents = studentsSnapshot.size;
  const totalSupervisors = supervisors.length;
  const totalTeams = Math.ceil(totalStudents / TEAM_SIZE);
  const projectsPerSupervisor =
    totalSupervisors > 0 ? Math.max(1, Math.ceil(totalTeams / totalSupervisors)) : 0;
  const totalAssigned = projectsPerSupervisor * totalSupervisors;

  return {
    totalStudents,
    totalSupervisors,
    totalTeams,
    projectsPerSupervisor,
    totalAssigned,
    teamSize: TEAM_SIZE,
  };
}

// Separate supervisor auth
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRef = db.collection("supervisors").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(400).json({ error: "Supervisor not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRef.update({ password: hashedPassword, isActive: true });

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userSnapshot = await db.collection("supervisors").where("email", "==", email).limit(1).get();

    if (userSnapshot.empty) return res.status(400).json({ error: "Supervisor not found" });

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const storedPassword = String(user.password || "");

    const isHashed = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$");
    const isMatch = isHashed ? await bcrypt.compare(password, storedPassword) : storedPassword === password;

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: "supervisor" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const defaultPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await db.collection("supervisors").doc(email).update({ password: hashedPassword });

    res.json({ message: "Password reset. Check your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supervisor project report APIs
router.get("/project-reports/summary/:email", async (req, res) => {
  try {
    const email = toLower(req.params.email);
    if (!email) return res.status(400).json({ message: "Supervisor email is required." });

    const [meta, assignmentsSnapshot, notificationsSnapshot, liveAllocation] = await Promise.all([
      getMeta(),
      db
        .collection(ASSIGNMENTS_COLLECTION)
        .where("supervisorEmail", "==", email)
        .get(),
      db
        .collection(NOTIFICATIONS_COLLECTION)
        .where("supervisorEmail", "==", email)
        .get(),
      getLiveAllocation(),
    ]);

    const assignments = assignmentsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => Number(a.serialNo || 0) - Number(b.serialNo || 0));

    const notifications = notificationsSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const aSeconds = a.createdAt?._seconds || 0;
        const bSeconds = b.createdAt?._seconds || 0;
        return bSeconds - aSeconds;
      })
      .slice(0, 20);
    const mergedMeta = {
      ...meta,
      ...liveAllocation,
      requiredProjectsPerSupervisor: liveAllocation.projectsPerSupervisor,
    };

    return res.json({
      meta: mergedMeta,
      assignments,
      notifications,
      stats: {
        total: assignments.length,
        submitted: assignments.filter((item) => item.status === "submitted").length,
        pending: assignments.filter((item) => item.status !== "submitted").length,
      },
    });
  } catch (error) {
    console.error("supervisor summary error:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/project-reports/assignment/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { supervisorEmail, projectTitle, projectDetails } = req.body;

    if (!assignmentId || !supervisorEmail) {
      return res.status(400).json({ message: "assignmentId and supervisorEmail are required." });
    }

    if (!String(projectTitle || "").trim() || !String(projectDetails || "").trim()) {
      return res.status(400).json({ message: "Project title and project details are required." });
    }

    const meta = await getMeta();
    if (meta.isLocked) {
      return res.status(400).json({ message: "Project list is locked. Editing is disabled." });
    }

    const assignmentRef = db.collection(ASSIGNMENTS_COLLECTION).doc(assignmentId);
    const assignmentDoc = await assignmentRef.get();

    if (!assignmentDoc.exists) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    const assignment = assignmentDoc.data();
    if (toLower(assignment.supervisorEmail) !== toLower(supervisorEmail)) {
      return res.status(403).json({ message: "Not authorized to update this assignment." });
    }

    await assignmentRef.update({
      projectTitle: String(projectTitle).trim(),
      projectDetails: String(projectDetails).trim(),
      status: "submitted",
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ message: `Project serial ${assignment.serialNo} submitted successfully.` });
  } catch (error) {
    console.error("submit assignment error:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default router;
