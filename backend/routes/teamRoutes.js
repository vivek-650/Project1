// backend/routes/teamRoutes.js
import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

/**
 * Helper: find student doc by roll
 * returns { docRef, data } or null
 */
async function findStudentByRoll(roll) {
  const snap = await db.collection("students").where("roll", "==", roll).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { docRef: doc.ref, data: doc.data() };
}

/**
 * POST /api/team/create
 * body: { leaderRoll, members: [{roll, name, email}, ...3 items] }
 * Creates a pending team and creates invitations for members (members' status = pending).
 */
router.post("/create", async (req, res) => {
  try {
    const { leaderRoll, members } = req.body;

    if (!leaderRoll) return res.status(400).json({ message: "leaderRoll required" });
    if (!Array.isArray(members) || members.length !== 3)
      return res.status(400).json({ message: "Exactly 3 member entries required" });

    // Basic validation: no duplicate rolls including leader
    const rolls = [leaderRoll, ...members.map((m) => m.roll)];
    const uniqueRolls = new Set(rolls);
    if (uniqueRolls.size !== 4) {
      return res.status(400).json({ message: "Duplicate roll numbers are not allowed" });
    }

    // Verify leader exists and is active and not already in a team
    const leader = await findStudentByRoll(leaderRoll);
    if (!leader) return res.status(404).json({ message: `Leader roll ${leaderRoll} not found` });
    if (!leader.data.passwordChanged || !leader.data.isActive)
      return res.status(403).json({ message: "Leader account not active" });
    if (leader.data.teamId) return res.status(400).json({ message: "Leader already in a team" });

    // Validate invited members: they must exist and not be in a team
    const invited = [];
    for (const m of members) {
      if (!m.roll || !m.name || !m.email) {
        return res.status(400).json({ message: "Each member must have roll, name & email" });
      }
      const student = await findStudentByRoll(m.roll);
      if (!student) return res.status(404).json({ message: `Invited student ${m.roll} not found` });
      if (student.data.teamId)
        return res.status(400).json({ message: `Student ${m.roll} already in a team` });
      invited.push({
        roll: m.roll,
        docRef: student.docRef,
        name: m.name,
        email: m.email,
      });
    }

    // Create team doc and invitations atomically
    const newTeamRef = db.collection("teams").doc(); // auto id
    const teamData = {
      teamId: newTeamRef.id,
      leaderRoll,
      members: [
        {
          roll: leaderRoll,
          name: leader.data.name || "",
          email: leader.data.email || "",
          status: "accepted",
        },
        // invited members initially pending
        ...invited.map((i) => ({
          roll: i.roll,
          name: i.name,
          email: i.email,
          status: "pending",
        })),
      ],
      status: "pending",
      createdAt: new Date(),
    };

    const batch = db.batch();
    batch.set(newTeamRef, teamData);

    // Add invitations to each invited student's document (invitations array)
    for (const inv of invited) {
      batch.update(inv.docRef, {
        invitations: db.FieldValue ? db.FieldValue.arrayUnion(newTeamRef.id) : [], // legacy: will be replaced below
      });
      // Note: if using the latest firebase-admin, use admin.firestore.FieldValue.arrayUnion
      // But since you're using Firestore client from @google-cloud/firestore, do below:
    }

    // Because db.FieldValue.arrayUnion may not be reachable the same way depending on client version,
    // we'll patch invitations after commit if needed. For safety, we'll also update leader doc to hold temp teamRef as creator (not finalized yet)
    // Use leader.docRef to set a pendingTeamId field (optional)
    batch.update(leader.docRef, { pendingTeamId: newTeamRef.id });

    await batch.commit();

    // After commit, update invited docs properly with arrayUnion using a fresh update (some clients do not expose FieldValue via db)
    // Attempt arrayUnion (works with @google-cloud/firestore)
    const arrayUnion = db.FieldValue ? db.FieldValue.arrayUnion : null;
    if (arrayUnion) {
      const updates = [];
      for (const inv of invited) {
        updates.push(inv.docRef.update({ invitations: arrayUnion(newTeamRef.id) }));
      }
      await Promise.all(updates);
    } else {
      // fallback: read each student doc and append manually (not ideal for concurrency but okay)
      for (const inv of invited) {
        const s = await inv.docRef.get();
        const current = s.data().invitations || [];
        if (!current.includes(newTeamRef.id)) {
          await inv.docRef.update({ invitations: [...current, newTeamRef.id] });
        }
      }
    }

    return res.json({
      message: "Team created (pending). Invitations sent.",
      teamId: newTeamRef.id,
    });
  } catch (err) {
    console.error("create team error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/team/requests/:roll
 * Returns pending invitations for a student
 */
router.get("/requests/:roll", async (req, res) => {
  try {
    const { roll } = req.params;
    const student = await findStudentByRoll(roll);
    if (!student) return res.status(404).json({ message: "Student not found" });
    const invitations = student.data.invitations || [];
    // fetch teams details for each invitation
    const teams = [];
    for (const teamId of invitations) {
      const tdoc = await db.collection("teams").doc(teamId).get();
      if (!tdoc.exists) continue;
      const t = tdoc.data();
      // return a minimal payload
      teams.push({
        teamId: t.teamId,
        leaderRoll: t.leaderRoll,
        members: t.members,
        status: t.status,
        createdAt: t.createdAt,
      });
    }
    return res.json({ invitations: teams });
  } catch (err) {
    console.error("requests error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/team/respond
 * body: { roll, teamId, action } action in ['accept','decline']
 * Member accepts/declines invitation.
 */
router.post("/respond", async (req, res) => {
  try {
    const { roll, teamId, action } = req.body;
    if (!roll || !teamId || !["accept", "decline"].includes(action)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Validate student
    const student = await findStudentByRoll(roll);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Validate team
    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) return res.status(404).json({ message: "Team not found" });

    const team = teamDoc.data();
    if (team.status !== "pending") {
      return res.status(400).json({ message: "Team is not pending" });
    }

    // Find the member entry
    const memberIndex = team.members.findIndex((m) => m.roll === roll);
    if (memberIndex === -1) {
      return res.status(400).json({ message: "You are not invited to this team" });
    }

    // Prevent acceptance if already in another team
    if (action === "accept" && student.data.teamId) {
      return res.status(400).json({ message: "You are already in another team" });
    }

    const updatedMembers = [...team.members];

    if (action === "accept") {
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        status: "accepted",
      };
    } else if (action === "decline") {
      // Remove declined member only
      updatedMembers.splice(memberIndex, 1);
    }

    const batch = db.batch();
    batch.update(teamRef, { members: updatedMembers });

    // Remove the invitation ONLY from this student's invitations array
    if (db.FieldValue && db.FieldValue.arrayRemove) {
      batch.update(student.docRef, {
        invitations: db.FieldValue.arrayRemove(teamId),
      });
    } else {
      const currentInv = student.data.invitations || [];
      const newInv = currentInv.filter((tid) => tid !== teamId);
      batch.update(student.docRef, { invitations: newInv });
    }

    await batch.commit();

    return res.json({
      message:
        action === "accept"
          ? "You have accepted the invitation"
          : "You have declined the invitation",
    });
  } catch (err) {
    console.error("respond error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/team/finalize
 * body: { leaderRoll, teamId }
 * Leader finalizes only when all members accepted.
 * On finalize: set status = active and set each student's teamId.
 */
router.post("/finalize", async (req, res) => {
  try {
    const { leaderRoll, teamId } = req.body;
    if (!leaderRoll || !teamId)
      return res.status(400).json({ message: "leaderRoll and teamId required" });

    // verify leader
    const leader = await findStudentByRoll(leaderRoll);
    if (!leader) return res.status(404).json({ message: "Leader not found" });

    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();
    if (!teamDoc.exists) return res.status(404).json({ message: "Team not found" });
    const team = teamDoc.data();

    if (team.leaderRoll !== leaderRoll) return res.status(403).json({ message: "Not authorized" });
    if (team.status !== "pending")
      return res.status(400).json({ message: "Team cannot be finalized" });

    // check that leader present and every invited member has status 'accepted' and that none are in other teams
    const allAccepted = team.members.every((m) => m.status === "accepted");
    if (!allAccepted)
      return res.status(400).json({ message: "All members must accept before finalizing" });

    // Re-check that none of the members are already in another team (race condition)
    const memberDocs = [];
    for (const m of team.members) {
      const s = await findStudentByRoll(m.roll);
      if (!s) return res.status(404).json({ message: `Member ${m.roll} not found` });
      if (s.data.teamId)
        return res.status(400).json({ message: `Member ${m.roll} already in a team` });
      memberDocs.push(s);
    }

    // All checks passed -> commit: set team.status = active and update each student's teamId
    const batch = db.batch();
    batch.update(teamRef, { status: "active", finalizedAt: new Date() });

    for (const md of memberDocs) {
      batch.update(md.docRef, {
        teamId: teamId,
        pendingTeamId: db.FieldValue ? db.FieldValue.delete() : null,
      });
      // If invitations array exists, remove it
      if (db.FieldValue && db.FieldValue.arrayRemove) {
        batch.update(md.docRef, {
          invitations: db.FieldValue.arrayRemove(teamId),
        });
      }
    }

    await batch.commit();

    return res.json({ message: "Team finalized and activated", teamId });
  } catch (err) {
    console.error("finalize error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/team/accepted-members
 * Returns a list of student rolls who are part of any pending team
 * with status 'accepted' (including leaders), i.e., not available for inviting.
 */
router.get("/accepted-members", async (_req, res) => {
  try {
    const snap = await db.collection("teams").where("status", "==", "pending").get();
    const accepted = new Set();
    snap.forEach((doc) => {
      const t = doc.data();
      const members = Array.isArray(t.members) ? t.members : [];
      members.forEach((m) => {
        if (m && m.roll && m.status === "accepted") {
          accepted.add(String(m.roll));
        }
      });
    });
    return res.json({ rolls: Array.from(accepted) });
  } catch (err) {
    console.error("accepted-members error:", err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/team/status/:roll
 * returns the team info for a student (active or pending)
 */
router.get("/status/:roll", async (req, res) => {
  try {
    const { roll } = req.params;
    const student = await findStudentByRoll(roll);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // If student has teamId -> fetch team
    if (student.data.teamId) {
      const tdoc = await db.collection("teams").doc(student.data.teamId).get();
      if (!tdoc.exists) return res.json({ team: null });
      return res.json({ team: tdoc.data() });
    }
    // If student has pendingTeamId (leader) -> fetch it
    if (student.data.pendingTeamId) {
      const tdoc = await db.collection("teams").doc(student.data.pendingTeamId).get();
      if (tdoc.exists) return res.json({ team: tdoc.data() });
    }

    return res.json({ team: null });
  } catch (err) {
    console.error("status error:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
