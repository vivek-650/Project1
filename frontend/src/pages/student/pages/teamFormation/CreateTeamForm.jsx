import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const emptyMember = { roll: "", name: "", email: "" };

const CreateTeamForm = ({ onCreated }) => {
  const roll = sessionStorage.getItem("roll");
  const [members, setMembers] = useState([
    { ...emptyMember },
    { ...emptyMember },
    { ...emptyMember },
  ]);
  const [students, setStudents] = useState([]); // list from backend
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setMemberField = (idx, field, value) => {
    const copy = [...members];
    // If user selected a roll from dropdown, auto-fill name & email from students list
    if (field === "roll") {
      const selectedRoll = value;
      const student = students.find((s) => String(s.roll) === String(selectedRoll));
      if (student) {
        copy[idx] = {
          ...copy[idx],
          roll: String(student.roll),
          name: student.name || student.fullName || student.email || "",
          email: student.email || "",
        };
      } else {
        copy[idx] = { ...copy[idx], roll: value };
      }
    } else {
      copy[idx] = { ...copy[idx], [field]: value };
    }
    setMembers(copy);
  };

  // Fetch students (rolls) for dropdown
  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        setStudentsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/admin/users`);
        if (!mounted) return;
        // Expecting array of student docs with at least roll and email/name
        const all = Array.isArray(res.data) ? res.data : [];
        // Only include active students
        const active = all.filter((s) => Boolean(s.isActive));
        setStudents(active);
      } catch (err) {
        console.error("Failed to fetch students:", err.message);
        setStudents([]);
      } finally {
        if (mounted) setStudentsLoading(false);
      }
    };
    fetchStudents();
    return () => {
      mounted = false;
    };
  }, []);

  const validate = () => {
    const rolls = members.map((m) => String(m.roll).trim());
    if (rolls.some((r) => r === "")) {
      setError("All member roll numbers are required.");
      return false;
    }
    if (new Set(rolls).size !== rolls.length) {
      setError("Duplicate member roll numbers are not allowed.");
      return false;
    }
    if (rolls.includes(roll)) {
      setError("Leader's own roll should not be included in invited members.");
      return false;
    }
    // Ensure name & email are present (they should be auto-filled when a roll is chosen)
    if (members.some((m) => !String(m.name).trim() || !String(m.email).trim())) {
      setError("Selected students must have name and email in the database.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    try {
      const payload = { leaderRoll: roll, members };
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/team/create`,
        payload
      );
      setMessage(res.data.message || "Team created (pending)");
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          <span>Create New Team</span>
        </CardTitle>
        <CardDescription>
          Select 3 team members to send invitations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {members.map((m, i) => (
            <Card
              key={i}
              className="bg-muted/30"
            >
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {i + 1}
                    </div>
                    <span className="font-medium text-foreground text-sm">Member {i + 1}</span>
                  </div>
                  {m.roll && (
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                    >
                      {m.roll}
                    </Badge>
                  )}
                </div>

                {studentsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading students...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Select Student
                      </label>
                      <Select
                        value={m.roll}
                        onValueChange={(value) => setMemberField(i, "roll", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose roll number" />
                        </SelectTrigger>
                        <SelectContent>
                          {students
                            .filter((s) => String(s.roll) !== String(roll))
                            .map((s) => (
                              <SelectItem key={s.roll} value={s.roll}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{s.roll}</span>
                                  {s.name && <span className="text-muted-foreground text-sm">• {s.name}</span>}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Auto-filled from selection"
                        value={m.name}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Auto-filled from selection"
                        value={m.email}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {error && (
            <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/5">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
              <p className="text-sm text-emerald-700">{message}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || studentsLoading} 
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Creating Team...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Team & Send Invitations
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTeamForm;
