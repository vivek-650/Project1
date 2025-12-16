import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingId, setUploadingId] = useState("");
  const email = sessionStorage.getItem("email");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4040";

  const fetchDrafts = async () => {
    if (!email) {
      setError("No email found in session.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/user/recipes/${email}/drafts`);
      if (response.ok) {
        const data = await response.json();
        setDrafts(data.drafts || []);
      } else {
        setError("Failed to fetch drafts");
      }
    } catch (e) {
      setError("Error fetching drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const markUploaded = async (id) => {
    setUploadingId(id);
    try {
      const res = await fetch(`${BASE_URL}/api/user/recipes/${id}/upload`, { method: "PATCH" });
      if (res.ok) {
        // Optimistic update: remove from drafts
        setDrafts((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      // ignore for now, could set error
    } finally {
      setUploadingId("");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Draft Recipes</CardTitle>
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
        ) : drafts.length === 0 ? (
          <div className="text-muted-foreground text-sm">No draft recipes.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Explanation</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title || "Untitled"}</TableCell>
                  <TableCell>
                    {Array.isArray(d.ingredients) ? d.ingredients.join(", ") : "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={d.explanation}>
                    {d.explanation || "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={uploadingId === d.id}
                      onClick={() => markUploaded(d.id)}
                    >
                      {uploadingId === d.id ? "Uploading..." : "Upload"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="justify-end text-xs text-muted-foreground">
        Drafts are private until uploaded.
      </CardFooter>
    </Card>
  );
};

export default Drafts;
