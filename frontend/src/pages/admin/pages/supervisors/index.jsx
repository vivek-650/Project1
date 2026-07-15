import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, Pencil, Trash2, RefreshCcw } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  contactNo: "",
  password: "",
  isActive: true,
};

const Supervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingEmail, setEditingEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchSupervisors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/coordinator/supervisors`);
      setSupervisors(Array.isArray(res.data?.supervisors) ? res.data.supervisors : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return supervisors;
    return supervisors.filter((item) => {
      return (
        String(item.name || "").toLowerCase().includes(q) ||
        String(item.email || "").toLowerCase().includes(q) ||
        String(item.contactNo || "").toLowerCase().includes(q)
      );
    });
  }, [search, supervisors]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingEmail("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingEmail) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/coordinator/supervisors/${encodeURIComponent(editingEmail)}`,
          {
            name: form.name,
            contactNo: form.contactNo,
            password: form.password || undefined,
            isActive: form.isActive,
          }
        );
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/coordinator/supervisors`, {
          name: form.name,
          email: form.email,
          contactNo: form.contactNo,
          password: form.password || undefined,
        });
      }
      resetForm();
      fetchSupervisors();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (item) => {
    setEditingEmail(item.email);
    setForm({
      name: item.name || "",
      email: item.email || "",
      contactNo: item.contactNo || "",
      password: "",
      isActive: item.isActive !== false,
    });
  };

  const onDelete = async (email) => {
    const confirmed = window.confirm(`Delete supervisor ${email}?`);
    if (!confirmed) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/coordinator/supervisors/${encodeURIComponent(email)}`
      );
      fetchSupervisors();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supervisor Management</CardTitle>
          <CardDescription>Create, update, and delete supervisor accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
              disabled={Boolean(editingEmail)}
            />
            <Input
              placeholder="Contact No"
              value={form.contactNo}
              onChange={(e) => setForm((s) => ({ ...s, contactNo: e.target.value }))}
            />
            <Input
              placeholder={editingEmail ? "New password (optional)" : "Password (optional)"}
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving
                  </>
                ) : editingEmail ? (
                  "Update"
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Create
                  </>
                )}
              </Button>
              {editingEmail && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle>All Supervisors</CardTitle>
              <CardDescription>Manage existing supervisor records.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search name/email/contact"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" onClick={fetchSupervisors}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading supervisors...
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No supervisors found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.email}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.contactNo || "-"}</TableCell>
                    <TableCell>
                      {item.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                          <Pencil className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(item.email)}>
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
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

export default Supervisors;
