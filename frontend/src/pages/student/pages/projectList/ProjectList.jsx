import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ListOrdered, RefreshCcw } from "lucide-react";

const ProjectList = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState("");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/coordinator/project-reports/students/list`);
      setProjects(Array.isArray(res.data?.projects) ? res.data.projects : []);
      setMeta(res.data?.meta || {});
    } catch (err) {
      setProjects([]);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-primary" /> Published Project List
          </CardTitle>
          <CardDescription>
            The list becomes visible only after coordinator locks the collected project reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Status: {meta?.isLocked ? "Locked & Published" : "Not Published"}
          </div>
          <Button variant="outline" onClick={fetchList}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading project list...
            </div>
          ) : error ? (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-sm text-muted-foreground">No published projects found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Project Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((item) => (
                  <TableRow key={item.assignmentId}>
                    <TableCell>{item.serialNo}</TableCell>
                    <TableCell>{item.supervisorName}</TableCell>
                    <TableCell>{item.supervisorContactNo || "-"}</TableCell>
                    <TableCell>{item.projectTitle}</TableCell>
                    <TableCell>{item.projectDetails}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;
