import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Download, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TeacherHome = () => {
  const navigate = useNavigate();

  // Data state
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch teacher notices
  useEffect(() => {
    let active = true;
    const fetchNotices = async () => {
      setLoading(true);
      setError("");
      try {
        const base = "http://localhost:4040"; // Update if you deploy behind a different origin
        const { data } = await axios.get(`${base}/api/super-admin/notices/teachers`);
        if (!active) return;
        setNotices(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!active) return;
        console.error(e);
        setError("Failed to load notices. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchNotices();
    return () => {
      active = false;
    };
  }, []);

  // Filter by search term
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFiltered(notices);
      return;
    }
    const next = notices.filter((n) => {
      const title = String(n.title || "").toLowerCase();
      const desc = String(n.description || "").toLowerCase();
      const serial = String(n.serialNo || "").toLowerCase();
      return title.includes(term) || desc.includes(term) || serial.includes(term);
    });
    setFiltered(next);
    setCurrentPage(1);
  }, [searchTerm, notices]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((filtered?.length || 0) / pageSize));
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  // Ensure current page stays within bounds when pageSize or filtered changes
  useEffect(() => {
    const newTotal = Math.max(1, Math.ceil((filtered?.length || 0) / pageSize));
    if (currentPage > newTotal) setCurrentPage(1);
  }, [filtered, pageSize, currentPage]);

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden text-foreground bg-background px-6 py-10">
      {/* Theme-aware background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#f5f7ff] via-white to-[#f5f7ff] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      <Card className="w-full max-w-6xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Teacher Notice Board</CardTitle>
          <CardDescription>Search and download notices for supervisors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search + Page Size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-1/2">
              <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search notice title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="px-4">#</TableHead>
                  <TableHead className="px-4">Date</TableHead>
                  <TableHead className="px-4">Title</TableHead>
                  <TableHead className="px-4 text-center">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Loading notices...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No notices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((notice, idx) => (
                    <TableRow key={notice.id ?? idx}>
                      <TableCell className="px-4 font-medium">{startIdx + idx + 1}</TableCell>
                      <TableCell className="px-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {notice.createdAt?._seconds
                            ? new Date(notice.createdAt._seconds * 1000).toLocaleDateString()
                            : "Unknown"}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 text-foreground">{notice.title}</TableCell>
                      <TableCell className="px-4 text-center">
                        {notice.documentUrl ? (
                          <Button
                            variant="link"
                            className="h-auto px-0"
                            onClick={() => window.open(notice.documentUrl, "_blank")}
                          >
                            <Download size={16} className="mr-1" />
                            Download
                          </Button>
                        ) : (
                          <span className="text-muted-foreground italic">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>

          {/* Go to Dashboard */}
          <div className="flex justify-center pt-2">
            <Button onClick={() => navigate("/supervisor/dashboard", { replace: true })}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherHome;
