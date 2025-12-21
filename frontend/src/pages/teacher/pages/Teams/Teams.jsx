 import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, RefreshCcw } from "lucide-react";

export const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const fetchTeams = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/teams`);
      const data = Array.isArray(res.data?.teams) ? res.data.teams : [];
      setTeams(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Derived data
  const filtered = teams.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      String(t.teamId).toLowerCase().includes(q) ||
      String(t.leaderRoll).toLowerCase().includes(q) ||
      t.members?.some((m) => String(m.roll).toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="p-6 space-y-6">
      <Card className="border border-border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-5 w-5 text-primary" /> Teams Overview
          </CardTitle>
          <CardDescription>All formed teams with leader & member status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Input
                  placeholder="Search team, leader or member roll..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="pr-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchTeams} disabled={loading} className="md:w-auto w-full">
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-4">#</TableHead>
                  <TableHead className="px-4">Team ID</TableHead>
                  <TableHead className="px-4">Leader</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Members</TableHead>
                  <TableHead className="px-4">Accepted</TableHead>
                  <TableHead className="px-4">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">Loading teams...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-destructive">{error}</TableCell>
                  </TableRow>
                ) : pageItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No teams found.</TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((t, idx) => {
                    const accepted = t.members?.filter(m => m.status === 'accepted').length || 0;
                    const total = t.members?.length || 0;
                    return (
                      <TableRow key={t.teamId}>
                        <TableCell className="px-4 font-medium">{start + idx + 1}</TableCell>
                        <TableCell className="px-4 font-mono text-xs">{t.teamId}</TableCell>
                        <TableCell className="px-4">{t.leaderRoll}</TableCell>
                        <TableCell className="px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${t.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{t.status}</span>
                        </TableCell>
                        <TableCell className="px-4">{total}</TableCell>
                        <TableCell className="px-4">{accepted}</TableCell>
                        <TableCell className="px-4 text-muted-foreground">
                          {t.createdAt?._seconds ? new Date(t.createdAt._seconds * 1000).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teams;
