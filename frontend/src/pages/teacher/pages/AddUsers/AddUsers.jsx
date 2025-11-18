import { useState } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddUsers = () => {
  const [user, setUser] = useState({ name: "", email: "", phone: "", recipeCount: "" });
  const [users, setUsers] = useState(null);
  const [submittingSingle, setSubmittingSingle] = useState(false);
  const [submittingBulk, setSubmittingBulk] = useState(false);
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const createUser = async () => {
    try {
      setSubmittingSingle(true);
      setMessage("");
      setError("");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/create-user`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(user),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(data?.message || "User created");
        setUser({ name: "", email: "", phone: "", recipeCount: "" });
      } else {
        setError(data?.message || "Failed to create user");
      }
    } catch (e) {
      setError("Network error creating user");
    } finally {
      setSubmittingSingle(false);
    }
  };

  const createMultipleUser = async () => {
    try {
      setSubmittingBulk(true);
      setMessage("");
      setError("");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/create-users`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(users),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setMessage(data?.message || "Users created");
        setUsers(null);
      } else {
        setError(data?.message || "Failed to create users");
      }
    } catch (e) {
      setError("Network error creating users");
    } finally {
      setSubmittingBulk(false);
      setConfirmBulkOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setUsers(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  const usersCount = Array.isArray(users) ? users.length : 0;

  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Add Users</h1>
      </div>

      {message && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Single user card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Single User</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-2">
                <label className="text-sm font-medium">User Name</label>
                <Input
                  name="name"
                  placeholder="Enter user name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter user email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  name="phone"
                  inputMode="numeric"
                  placeholder="Enter phone number"
                  value={user.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Recipe Count</label>
                <Input
                  name="recipeCount"
                  type="number"
                  min={0}
                  placeholder="Enter recipe count"
                  value={user.recipeCount}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={createUser}
                  disabled={submittingSingle || !user.name || !user.email}
                >
                  {submittingSingle ? "Adding..." : "Add User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Bulk users card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bulk Create via Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Upload .xlsx file</label>
                <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
                <p className="text-xs text-muted-foreground">
                  Columns: name, email, phone, recipeCount
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Users detected</span>
                <span className="font-medium">{usersCount}</span>
              </div>

              {usersCount > 0 && (
                <ScrollArea className="h-64 rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u, i) => (
                        <TableRow key={i}>
                          <TableCell className="truncate">{u.name}</TableCell>
                          <TableCell className="truncate">{u.email}</TableCell>
                          <TableCell className="truncate">{u.phone}</TableCell>
                          <TableCell className="text-right">{u.recipeCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}

              <div className="flex justify-end gap-2">
                <Dialog open={confirmBulkOpen} onOpenChange={setConfirmBulkOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" disabled={!usersCount}>
                      Review & Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create {usersCount} users?</DialogTitle>
                      <DialogDescription>
                        This will create all users from the uploaded file. Please ensure the columns
                        are correct.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmBulkOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createMultipleUser} disabled={submittingBulk}>
                        {submittingBulk ? "Creating..." : "Confirm"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
