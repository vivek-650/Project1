import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

// 1. Add Recipe
router.post("/add-recipe", async (req, res) => {
  try {
    const { email, title, ingredients, instructions, explanation } = req.body;
    const recipeRef = db.collection("recipes").doc();
    await recipeRef.set({ email, title, ingredients, instructions, explanation });

    res.json({ message: "Recipe added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get Recipes for a User
router.get("/recipes/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const recipesSnapshot = await db.collection("recepies").where("email", "==", email).get();
    const recipes = recipesSnapshot.docs.map(doc => doc.data());

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
