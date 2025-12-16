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

const Uploaded = () => {
  const [uploaded, setUploaded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const email = sessionStorage.getItem("email");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4040";

  const fetchUploaded = async () => {
    if (!email) {
      setError("No email found in session.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/user/recipes/${email}/uploaded`);
      if (response.ok) {
        const data = await response.json();
        setUploaded(data.uploaded || []);
      } else {
        setError("Failed to fetch uploaded recipes");
      }
    } catch (e) {
      setError("Error fetching uploaded recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploaded();
  }, []);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Uploaded Recipes</CardTitle>
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
        ) : uploaded.length === 0 ? (
          <div className="text-muted-foreground text-sm">No uploaded recipes yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Explanation</TableHead>
                <TableHead>Uploaded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploaded.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title || "Untitled"}</TableCell>
                  <TableCell>
                    {Array.isArray(r.ingredients) ? r.ingredients.join(", ") : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={r.explanation}>
                    {r.explanation || "-"}
                  </TableCell>
                  <TableCell>
                    {r.uploadedAt && r.uploadedAt.seconds
                      ? new Date(r.uploadedAt.seconds * 1000).toLocaleDateString()
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

export default Uploaded;
