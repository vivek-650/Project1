import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Lock, BellRing, RefreshCcw, ListChecks } from "lucide-react";

const ProjectReportsManager = () => {
  const [summary, setSummary] = useState({
    meta: {},
    stats: {},
    pendingList: [],
    completeList: [],
    assignments: [],
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/coordinator/project-reports/summary`);
      setSummary({
        meta: res.data?.meta || {},
        stats: res.data?.stats || {},
        pendingList: Array.isArray(res.data?.pendingList) ? res.data.pendingList : [],
        completeList: Array.isArray(res.data?.completeList) ? res.data.completeList : [],
        assignments: Array.isArray(res.data?.assignments) ? res.data.assignments : [],
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const generateAssignments = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/coordinator/project-reports/generate`);
      alert(res.data?.message || "Assignments generated");
      fetchSummary();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setGenerating(false);
    }
  };

  const sendPendingIntimation = async () => {
    setNotifying(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/coordinator/project-reports/intimate-pending`
      );
      alert(res.data?.message || "Pending intimations sent");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setNotifying(false);
    }
  };

  const lockAndPublish = async () => {
    setLocking(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/coordinator/project-reports/lock`);
      alert(res.data?.message || "Locked and published");
      fetchSummary();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(msg);
    } finally {
      setLocking(false);
    }
  };

  const sortedList = useMemo(() => summary.completeList || [], [summary.completeList]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" /> Project Report Coordination
          </CardTitle>
          <CardDescription>
            Generate serial allocation for supervisors, monitor pending submissions, and lock final list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-xl font-semibold">{summary.meta?.totalStudents ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Supervisors</p>
              <p className="text-xl font-semibold">{summary.meta?.totalSupervisors ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Assigned</p>
              <p className="text-xl font-semibold">{summary.stats?.total ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-semibold">{summary.stats?.pending ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Potential Teams (4/Team)</p>
              <p className="text-xl font-semibold">{summary.meta?.totalTeams ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Per Supervisor</p>
              <p className="text-xl font-semibold">{summary.meta?.projectsPerSupervisor ?? 0}</p>
            </div>
            <div className="p-3 rounded border bg-muted/20">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-lg font-semibold">{summary.meta?.isLocked ? "Locked" : "Open"}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <Button onClick={generateAssignments} disabled={generating || summary.meta?.isLocked}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating
                </>
              ) : (
                "Generate Serial List"
              )}
            </Button>
            <Button variant="outline" onClick={sendPendingIntimation} disabled={notifying}>
              {notifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending
                </>
              ) : (
                <>
                  <BellRing className="h-4 w-4 mr-2" /> Intimate Pending
                </>
              )}
            </Button>
            <Button onClick={lockAndPublish} disabled={locking || summary.meta?.isLocked}>
              {locking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Locking
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" /> Lock & Publish
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={fetchSummary}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>

          {summary.meta?.isLocked && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
              Final list is locked and visible to students
            </Badge>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Collection List</CardTitle>
          <CardDescription>Project serial and supervisor names with pending submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : summary.pendingList.length === 0 ? (
            <div className="text-sm text-muted-foreground">No pending project reports.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Supervisor Name</TableHead>
                  <TableHead>Contact No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.pendingList.map((item) => (
                  <TableRow key={item.assignmentId}>
                    <TableCell>{item.serialNo}</TableCell>
                    <TableCell>{item.supervisorName}</TableCell>
                    <TableCell>{item.supervisorContactNo || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collected Project List (Sorted)</CardTitle>
          <CardDescription>
            Includes project serial no, supervisor name, contact no, and project details sorted by supervisor name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
          ) : sortedList.length === 0 ? (
            <div className="text-sm text-muted-foreground">No submitted projects yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Project Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedList.map((item) => (
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

export default ProjectReportsManager;
