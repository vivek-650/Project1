import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Recepies = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const email = sessionStorage.getItem("email");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4040";

  const getRecipes = async () => {
    if (!email) {
      setError("No email found in session.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/user/recipes/${email}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      } else {
        setError("Failed to fetch recipes");
      }
    } catch (e) {
      setError("Error fetching recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>All Recipes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : recipes.length === 0 ? (
          <div className="text-muted-foreground text-sm">No recipes found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title || "Untitled"}</TableCell>
                  <TableCell>
                    {Array.isArray(r.ingredients) ? r.ingredients.join(", ") : "-"}
                  </TableCell>
                  <TableCell>{r.uploaded ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {r.createdAt && r.createdAt.seconds
                      ? new Date(r.createdAt.seconds * 1000).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Recepies;
