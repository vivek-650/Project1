import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | active | inactive
  const [pendingEmail, setPendingEmail] = useState(null); // for confirm dialog

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/users`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        console.log("Error in get Users");
      }
    } catch (error) {
      console.log("Error during get Users: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const blockUser = async (email) => {
    try {
      const userData = { email };
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/block-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        getUsers();
      } else {
        console.log("Error during block user: ", data?.message);
      }
    } catch (error) {
      console.log("Error in block user api: ", error);
    } finally {
      setPendingEmail(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery =
        !q ||
        [u.name, u.email, u.phone].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
      const matchesStatus =
        status === "all" ||
        (status === "active" && u.isActive) ||
        (status === "inactive" && !u.isActive);
      return matchesQuery && matchesStatus;
    });
  }, [users, search, status]);

  return (
    <div className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Users</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={getUsers}>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <Input
                placeholder="Search by name, email, phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={status === "all" ? "default" : "outline"}
                onClick={() => setStatus("all")}
              >
                All
              </Button>
              <Button
                variant={status === "active" ? "default" : "outline"}
                onClick={() => setStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={status === "inactive" ? "default" : "outline"}
                onClick={() => setStatus("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-12 items-center gap-3">
                  <div className="col-span-3 sm:col-span-4 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1 w-full">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                  <Skeleton className="col-span-3 h-4 sm:col-span-2" />
                  <Skeleton className="col-span-2 h-4 sm:col-span-2" />
                  <Skeleton className="col-span-2 h-6 sm:col-span-2" />
                  <Skeleton className="col-span-2 h-9 sm:col-span-2" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-sm text-muted-foreground">
              <p>No users found</p>
              <div className="mt-3">
                <Button variant="outline" onClick={getUsers}>
                  Reload
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[320px]">User</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((item) => (
                  <TableRow key={item.id || item.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={item.avatarUrl} alt={item.name} />
                          <AvatarFallback>
                            {(item?.name || item?.email || "?").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="font-medium leading-none">{item.name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{item.role || "User"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="truncate">{item.roll}</TableCell>

                    <TableCell>
                      {item.isActive ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.isActive ? (
                        <Dialog
                          open={pendingEmail === item.email}
                          onOpenChange={(open) => !open && setPendingEmail(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setPendingEmail(item.email)}
                            >
                              Block
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Block this user?</DialogTitle>
                              <DialogDescription>
                                This will immediately revoke access for {item.email}. You can
                                unblock later from admin tools.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setPendingEmail(null)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => blockUser(item.email)}>
                                Confirm
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Blocked
                        </Button>
                      )}
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
