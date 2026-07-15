import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, CheckCircle2, Clock, BellRing } from "lucide-react";

const ProjectReports = () => {
  const supervisorEmail = (sessionStorage.getItem("email") || "").trim().toLowerCase();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ meta: {}, assignments: [], notifications: [], stats: {} });
  const [drafts, setDrafts] = useState({});
  const [editMode, setEditMode] = useState({});
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const fetchAssignments = useCallback(async () => {
    if (!supervisorEmail) {
      setError("Supervisor email is missing in session. Please login again.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/supervisor/project-reports/summary/${encodeURIComponent(supervisorEmail)}`
      );
      const payload = {
        meta: res.data?.meta || {},
        assignments: Array.isArray(res.data?.assignments) ? res.data.assignments : [],
        notifications: Array.isArray(res.data?.notifications) ? res.data.notifications : [],
        stats: res.data?.stats || {},
      };
      setData(payload);

      const nextDrafts = {};
      payload.assignments.forEach((item) => {
        nextDrafts[item.assignmentId] = {
          projectTitle: item.projectTitle || "",
          projectDetails: item.projectDetails || "",
        };
      });
      setDrafts(nextDrafts);

      const nextEditMode = {};
      payload.assignments.forEach((item) => {
        nextEditMode[item.assignmentId] = item.status !== "submitted";
      });
      setEditMode(nextEditMode);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [supervisorEmail]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const pendingCount = useMemo(
    () => data.assignments.filter((item) => item.status !== "submitted").length,
    [data.assignments]
  );

  const updateDraft = (assignmentId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [assignmentId]: {
        ...(prev[assignmentId] || { projectTitle: "", projectDetails: "" }),
        [field]: value,
      },
    }));
  };

  const enableEdit = (assignmentId) => {
    if (data.meta?.isLocked) return;
    setEditMode((prev) => ({ ...prev, [assignmentId]: true }));
  };

  const submitAssignment = async (assignmentId) => {
    const itemDraft = drafts[assignmentId] || { projectTitle: "", projectDetails: "" };
    if (!itemDraft.projectTitle.trim() || !itemDraft.projectDetails.trim()) {
      alert("Project title and details are required.");
      return;
    }

    setSavingId(assignmentId);
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/supervisor/project-reports/assignment/${assignmentId}`,
        {
          supervisorEmail,
          projectTitle: itemDraft.projectTitle,
          projectDetails: itemDraft.projectDetails,
        }
      );
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Report Submission</CardTitle>
          <CardDescription>
            Fill assigned project serials. Once coordinator locks, editing is disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-xs text-muted-foreground">Assigned</p>
              <p className="text-2xl font-semibold">{data.stats?.total ?? 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-2xl font-semibold">{data.stats?.submitted ?? 0}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold">{data.stats?.pending ?? pendingCount}</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-xs text-muted-foreground">List Status</p>
              <p className="text-lg font-semibold">
                {data.meta?.isLocked ? "Locked" : "Open"}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/20">
              <p className="text-xs text-muted-foreground">Required Projects</p>
              <p className="text-2xl font-semibold">{data.meta?.projectsPerSupervisor ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.notifications?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" /> Pending Intimations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-36">
              <div className="space-y-2">
                {data.notifications.map((notice) => (
                  <div key={notice.id} className="text-sm p-2 rounded border bg-amber-50 text-amber-800">
                    {notice.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assigned Project Serials</CardTitle>
          <CardDescription>
            Submit details for each serial number assigned by coordinator. Submitted rows remain
            editable until coordinator locks the project list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading assignments...
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : data.assignments.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No assignments generated yet. Contact coordinator.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Project Details</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.assignments.map((item) => {
                  const draft = drafts[item.assignmentId] || {
                    projectTitle: "",
                    projectDetails: "",
                  };
                  const disabled = Boolean(data.meta?.isLocked) || !editMode[item.assignmentId];
                  const isSubmitted = item.status === "submitted";

                  return (
                    <TableRow key={item.assignmentId}>
                      <TableCell className="font-medium">{item.serialNo}</TableCell>
                      <TableCell>
                        {item.status === "submitted" ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Submitted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={draft.projectTitle}
                          onChange={(e) => updateDraft(item.assignmentId, "projectTitle", e.target.value)}
                          placeholder="Enter project title"
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={draft.projectDetails}
                          onChange={(e) => updateDraft(item.assignmentId, "projectDetails", e.target.value)}
                          placeholder="Enter project details"
                          disabled={disabled}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          {isSubmitted && !editMode[item.assignmentId] && !data.meta?.isLocked && (
                            <Button size="sm" variant="outline" onClick={() => enableEdit(item.assignmentId)}>
                              Edit
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => submitAssignment(item.assignmentId)}
                            disabled={disabled || savingId === item.assignmentId}
                          >
                            {savingId === item.assignmentId ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Saving
                              </>
                            ) : (
                              "Submit"
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectReports;
