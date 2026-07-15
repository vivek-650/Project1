import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { db } from "../config/firebase.js";

const coordinatorRoutes = express.Router();
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
      teamSize: TEAM_SIZE,
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

  return Array.from(byEmail.values()).sort((a, b) => a.name.localeCompare(b.name));
}

async function clearAssignmentsAndNotifications() {
  const [assignments, notifications] = await Promise.all([
    db.collection(ASSIGNMENTS_COLLECTION).get(),
    db.collection(NOTIFICATIONS_COLLECTION).get(),
  ]);
  const batch = db.batch();
  assignments.docs.forEach((doc) => batch.delete(doc.ref));
  notifications.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
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

// 1. User Signup (First-time password change)
coordinatorRoutes.post("/signup", async (req, res) => {
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
coordinatorRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email, password ? "Password provided" : "No password");
    const userSnapshot = await db.collection("coordinators").where("email", "==", email).get();

    if (userSnapshot.empty) return res.status(400).json({ error: "Coordinator not found" });

    const user = userSnapshot.docs[0].data();

    const storedPassword = String(user.password || "");
    const isHashed = storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$");
    const isMatch = isHashed
      ? await bcrypt.compare(password, storedPassword)
      : storedPassword === password;

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: "coordinator" }, process.env.JWT_SECRET, {
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

    await db.collection("coordinators").doc(email).update({ password: hashedPassword });

    res.json({ message: "Password reset. Check your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project reports coordinator APIs - all under /api/coordinator/project-reports/*
coordinatorRoutes.post("/project-reports/generate", async (_req, res) => {
  try {
    const studentsSnapshot = await db.collection("students").get();
    const supervisors = await getSupervisors();

    const totalStudents = studentsSnapshot.size;
    const totalSupervisors = supervisors.length;

    if (!totalSupervisors) {
      return res.status(400).json({ message: "No supervisors found to generate project slots." });
    }

    const totalTeams = Math.ceil(totalStudents / TEAM_SIZE);
    const projectsPerSupervisor = Math.max(1, Math.ceil(totalTeams / totalSupervisors));
    const totalAssigned = projectsPerSupervisor * totalSupervisors;

    await clearAssignmentsAndNotifications();

    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    let serialNo = 1;

    for (const supervisor of supervisors) {
      for (let i = 0; i < projectsPerSupervisor; i += 1) {
        const assignmentRef = db.collection(ASSIGNMENTS_COLLECTION).doc();
        batch.set(assignmentRef, {
          assignmentId: assignmentRef.id,
          serialNo,
          supervisorEmail: supervisor.email,
          supervisorName: supervisor.name,
          supervisorContactNo: supervisor.contactNo,
          projectTitle: "",
          projectDetails: "",
          status: "pending",
          createdAt: now,
          updatedAt: now,
          submittedAt: null,
        });
        serialNo += 1;
      }
    }

    batch.set(
      db.collection(META_COLLECTION).doc(META_DOC_ID),
      {
        projectsPerSupervisor,
        totalAssigned,
        totalSupervisors,
        totalStudents,
        totalTeams,
        teamSize: TEAM_SIZE,
        generatedAt: now,
        isLocked: false,
        isPublished: false,
        lockedAt: null,
      },
      { merge: true }
    );

    await batch.commit();

    return res.status(201).json({
      message: "Project serial list generated for all supervisors.",
      projectsPerSupervisor,
      totalAssigned,
      totalSupervisors,
      totalStudents,
      totalTeams,
      teamSize: TEAM_SIZE,
    });
  } catch (error) {
    console.error("generate project serials error:", error);
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.get("/project-reports/summary", async (_req, res) => {
  try {
    const [meta, assignmentsSnapshot, liveAllocation] = await Promise.all([
      getMeta(),
      db.collection(ASSIGNMENTS_COLLECTION).orderBy("serialNo", "asc").get(),
      getLiveAllocation(),
    ]);

    const assignments = assignmentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const submittedCount = assignments.filter((item) => item.status === "submitted").length;

    const pendingList = assignments
      .filter((item) => item.status !== "submitted")
      .sort((a, b) => a.supervisorName.localeCompare(b.supervisorName));

    const completeList = assignments
      .filter((item) => item.status === "submitted")
      .sort((a, b) => {
        const byName = a.supervisorName.localeCompare(b.supervisorName);
        return byName !== 0 ? byName : a.serialNo - b.serialNo;
      });

    const mergedMeta = {
      ...meta,
      ...liveAllocation,
    };

    return res.json({
      meta: mergedMeta,
      stats: {
        total: assignments.length,
        submitted: submittedCount,
        pending: assignments.length - submittedCount,
      },
      pendingList,
      completeList,
      assignments,
    });
  } catch (error) {
    console.error("summary error:", error);
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.post("/project-reports/intimate-pending", async (_req, res) => {
  try {
    const pendingSnapshot = await db
      .collection(ASSIGNMENTS_COLLECTION)
      .where("status", "==", "pending")
      .get();

    if (pendingSnapshot.empty) {
      return res.json({ message: "No pending reports found." });
    }

    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();

    pendingSnapshot.docs.forEach((doc) => {
      const assignment = doc.data();
      const noticeRef = db.collection(NOTIFICATIONS_COLLECTION).doc();
      batch.set(noticeRef, {
        notificationId: noticeRef.id,
        supervisorEmail: assignment.supervisorEmail,
        supervisorName: assignment.supervisorName,
        assignmentId: assignment.assignmentId,
        serialNo: assignment.serialNo,
        message: `Project serial ${assignment.serialNo} is still pending. Please submit project details.`,
        status: "unread",
        createdAt: now,
      });
    });

    await batch.commit();

    return res.json({
      message: "Pending intimations sent to supervisors.",
      totalIntimations: pendingSnapshot.size,
    });
  } catch (error) {
    console.error("intimation error:", error);
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.post("/project-reports/lock", async (_req, res) => {
  try {
    const pendingSnapshot = await db
      .collection(ASSIGNMENTS_COLLECTION)
      .where("status", "==", "pending")
      .get();

    if (!pendingSnapshot.empty) {
      const pending = pendingSnapshot.docs.map((doc) => doc.data());
      return res.status(400).json({
        message: "Cannot lock list. Some project reports are still pending.",
        pending,
      });
    }

    await db
      .collection(META_COLLECTION)
      .doc(META_DOC_ID)
      .set(
        {
          isLocked: true,
          isPublished: true,
          lockedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    return res.json({ message: "Project report list locked and published to students." });
  } catch (error) {
    console.error("lock error:", error);
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.get("/project-reports/students/list", async (_req, res) => {
  try {
    const meta = await getMeta();
    if (!meta.isLocked || !meta.isPublished) {
      return res.status(403).json({
        message: "Project list is not published yet. It will be available after coordinator lock.",
      });
    }

    const snapshot = await db
      .collection(ASSIGNMENTS_COLLECTION)
      .where("status", "==", "submitted")
      .get();

    const projects = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const byName = String(a.supervisorName || "").localeCompare(String(b.supervisorName || ""));
        if (byName !== 0) return byName;
        return Number(a.serialNo || 0) - Number(b.serialNo || 0);
      });
    return res.json({ meta, projects });
  } catch (error) {
    console.error("student list error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// Supervisor CRUD APIs under /api/coordinator/supervisors
coordinatorRoutes.get("/supervisors", async (_req, res) => {
  try {
    const snapshot = await db.collection("supervisors").orderBy("name", "asc").get();
    const supervisors = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || doc.id,
        name: data.name || "",
        contactNo: data.contactNo || data.phone || "",
        role: data.role || "supervisor",
        isActive: data.isActive !== false,
        createdAt: data.createdAt || null,
      };
    });
    return res.json({ supervisors });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.post("/supervisors", async (req, res) => {
  try {
    const { name, email, contactNo, password } = req.body || {};
    const normalizedEmail = toLower(email);

    if (!name || !normalizedEmail) {
      return res.status(400).json({ message: "name and email are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const supervisorRef = db.collection("supervisors").doc(normalizedEmail);
    const existing = await supervisorRef.get();
    if (existing.exists) {
      return res.status(409).json({ message: "Supervisor already exists." });
    }

    const plainPassword = String(password || "Supervisor@123");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await supervisorRef.set({
      name: String(name).trim(),
      email: normalizedEmail,
      contactNo: String(contactNo || "").trim(),
      role: "supervisor",
      isActive: true,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: "Supervisor created successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.put("/supervisors/:email", async (req, res) => {
  try {
    const email = toLower(req.params.email);
    const { name, contactNo, isActive, password } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: "Supervisor email is required." });
    }

    const supervisorRef = db.collection("supervisors").doc(email);
    const existing = await supervisorRef.get();
    if (!existing.exists) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    const updatePayload = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (typeof name === "string") updatePayload.name = name.trim();
    if (typeof contactNo === "string") updatePayload.contactNo = contactNo.trim();
    if (typeof isActive === "boolean") updatePayload.isActive = isActive;
    if (password) updatePayload.password = await bcrypt.hash(String(password), 10);

    await supervisorRef.update(updatePayload);

    return res.json({ message: "Supervisor updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

coordinatorRoutes.delete("/supervisors/:email", async (req, res) => {
  try {
    const email = toLower(req.params.email);
    if (!email) {
      return res.status(400).json({ message: "Supervisor email is required." });
    }

    const supervisorRef = db.collection("supervisors").doc(email);
    const existing = await supervisorRef.get();
    if (!existing.exists) {
      return res.status(404).json({ message: "Supervisor not found." });
    }

    await supervisorRef.delete();
    return res.json({ message: "Supervisor deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default coordinatorRoutes;
