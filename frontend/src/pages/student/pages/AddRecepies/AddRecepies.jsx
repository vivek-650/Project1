import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";

const emptyRecipe = () => ({
  title: "",
  ingredients: [],
  instructions: "",
  explanation: "",
  uploaded: false,
});

const AddRecepies = () => {
  const email = sessionStorage.getItem("email");
  const initialCount = parseInt(sessionStorage.getItem("recipeCount") || "1", 10);
  const [recipes, setRecipes] = useState(Array.from({ length: initialCount }, emptyRecipe));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4040";

  const updateRecipe = (idx, patch) => {
    setRecipes((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addNewRecipe = () => setRecipes((prev) => [...prev, emptyRecipe()]);
  const removeRecipe = (idx) => setRecipes((prev) => prev.filter((_, i) => i !== idx));

  const submitAll = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    if (!email) {
      setError("Missing user email in session storage.");
      setSubmitting(false);
      return;
    }
    const cleaned = recipes.map((r) => ({
      title: r.title.trim(),
      ingredients: r.ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: r.instructions.trim(),
      explanation: r.explanation.trim(),
      uploaded: Boolean(r.uploaded),
    }));
    if (cleaned.some((r) => !r.title)) {
      setError("Each recipe requires a title.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/user/add-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recipes: cleaned }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(`Added ${cleaned.length} recipe(s).`);
        setRecipes([emptyRecipe()]);
      } else {
        setError("Failed to add recipes.");
      }
    } catch (e) {
      setError("Network error adding recipes.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add Recipes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Title</TableHead>
              <TableHead>Ingredients (comma separated)</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead>Explanation</TableHead>
              <TableHead>Uploaded?</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <Input
                    placeholder="Title"
                    value={r.title}
                    onChange={(e) => updateRecipe(idx, { title: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="ing1, ing2"
                    value={r.ingredients.join(", ")}
                    onChange={(e) =>
                      updateRecipe(idx, {
                        ingredients: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Instructions"
                    value={r.instructions}
                    onChange={(e) => updateRecipe(idx, { instructions: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Explanation"
                    value={r.explanation}
                    onChange={(e) => updateRecipe(idx, { explanation: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={r.uploaded}
                    onChange={(e) => updateRecipe(idx, { uploaded: e.target.checked })}
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeRecipe(idx)}
                    disabled={recipes.length === 1 || submitting}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewRecipe} disabled={submitting}>
            Add Another
          </Button>
          <Button onClick={submitAll} disabled={submitting || recipes.length === 0}>
            {submitting ? "Submitting..." : "Submit All"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-end">
        Recipes saved as drafts unless Uploaded is checked.
      </CardFooter>
    </Card>
  );
};

export default AddRecepies;
