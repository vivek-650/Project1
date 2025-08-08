import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

//user login
router.post("/login", async (req, res) => {
  try {
    const { roll, password } = req.body;
    console.log("Roll: ", roll, " Pass: ", password);
    const userSnapshot = await db
      .collection("students")
      .where("roll", "==", roll)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userSnapshot.docs[0].data();
    console.log("user: ", user);

    if (user.password !== password) {
      // console.log("pass on database: ", user.password);
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.passwordChanged) {
      if (user.isActive) {
        return res.status(200).json({
          data: {
            name: user.name,
            roll: user.roll,
            email: user.email,
            recipeCount: user.recipeCount,
            token: "userToken000",
          },
          message: "User logged in sucessfully",
        });
      } else {
        return res.status(201).json({
          message: "Your account is not active please contact your admin",
        });
      }
    } else {
      return res.status(203).json({ message: "Change password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change Password
router.post("/change-password", async (req, res) => {
  try {
    const { roll, newPassword } = req.body;
    const userSnapshot = await db.collection("students").doc(roll).get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.collection("students").doc(userSnapshot.id).update({
      password: newPassword,
      passwordChanged: true,
      isActive: true,
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update-profile
router.post("/update-profile", async (req, res) => {
  try {
    const { name, contact, address, role, roll } = req.body;
    console.log("Update Profile: ", req.body);
    const userSnapshot = await db.collection("students").doc(roll).get();
    if (!userSnapshot.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    await db.collection("students").doc(userSnapshot.id).update({
      name,
      contact,
      address,
      role,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Add Recipe
router.post("/add-recipe", async (req, res) => {
  try {
    const { email, recipes } = req.body;

    if (!Array.isArray(recipes)) {
      return res.status(400).json({ message: "Recipes should be an array" });
    }

    const batch = db.batch();

    recipes.forEach((recipe) => {
      const { title, ingredients, instructions, explanation } = recipe;
      const recipeRef = db.collection("recipes").doc();
      batch.set(recipeRef, {
        email,
        title,
        ingredients,
        instructions,
        explanation,
      });
    });

    await batch.commit();

    res.json({ message: "Recipes added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Recipes for a User
router.get("/recipes/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const recipesSnapshot = await db
      .collection("recipes")
      .where("email", "==", email)
      .get();
    const recipes = recipesSnapshot.docs.map((doc) => doc.data());
    console.log(recipes[0].recipes);
    res.json(recipes[0].recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// 3. get users details
router.get("/user-details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const recipesSnapshot = await db
      .collection("students")
      .where("email", "==", email)
      .get();
    const userDetails = recipesSnapshot.docs.map((doc) => doc.data());
    console.log(userDetails);
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, name } = req.body;
    const userSnapshot = await db
      .collection("students")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found." });
    }

    // Store reset request
    await db.collection("requests").add({
      email,
      status: "pending",
      requestedAt: new Date(),
    });

    res.json({ message: "Password reset request sent to admin." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /create-team
router.post("/create-team", async (req, res) => {
  const { roll } = req.body;

  if (!roll) {
    return res.status(400).json({ message: "Roll number is required" });
  }

  const studentSnap = await db
    .collection("students")
    .where("roll", "==", roll)
    .limit(1)
    .get();

  if (studentSnap.empty) {
    return res.status(404).json({ message: "Student not found" });
  }

  const studentDoc = studentSnap.docs[0];
  const student = studentDoc.data();

  if (student.teamId) {
    return res.status(400).json({ message: "Already in a team" });
  }

  const newTeamRef = db.collection("teams").doc(); // auto ID
  const batch = db.batch();

  batch.set(newTeamRef, {
    teamId: newTeamRef.id,
    createdBy: roll,
    members: [roll],
    status: "pending",
    createdAt: new Date(),
  });

  batch.update(studentDoc.ref, { teamId: newTeamRef.id, isTeamLeader: true });

  await batch.commit();

  res.json({ message: "Team created successfully", teamId: newTeamRef.id });
});

// POST /join-team
router.post("/join-team", async (req, res) => {
  const { roll, teamId } = req.body;

  const studentRef = db.collection("students").doc(roll);
  const studentDoc = await studentRef.get();
  if (!studentDoc.exists) return res.status(404).json({ message: "Student not found" });

  const student = studentDoc.data();
  if (student.teamId) return res.status(400).json({ message: "Already in a team" });

  const teamRef = db.collection("teams").doc(teamId);
  const teamDoc = await teamRef.get();
  if (!teamDoc.exists) return res.status(404).json({ message: "Team not found" });

  const team = teamDoc.data();
  if (team.status !== "pending") return res.status(400).json({ message: "Team is full or locked" });

  if (team.members.length >= 4)
    return res.status(400).json({ message: "Team already has 4 members" });

  const updatedMembers = [...team.members, roll];
  const updates = {
    members: updatedMembers,
    status: updatedMembers.length === 4 ? "locked" : "pending",
  };

  const batch = db.batch();
  batch.update(teamRef, updates);
  batch.update(studentRef, { teamId: teamId });

  await batch.commit();

  res.json({ message: "Joined team successfully" });
});

export default router;
