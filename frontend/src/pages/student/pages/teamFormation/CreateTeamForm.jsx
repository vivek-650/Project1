// frontend/src/components/team/CreateTeamForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Loader2 } from "lucide-react";

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
        setStudents(Array.isArray(res.data) ? res.data : []);
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
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-blue-500" />
        Create Team <span className="text-gray-500 text-sm">(fill 3 members)</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {members.map((m, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div className="text-sm font-medium mb-3 text-gray-600">
              Member {i + 1}
            </div>
            {studentsLoading ? (
              <div className="mb-2 p-2 text-sm text-gray-500">Loading students...</div>
            ) : (
              <select
                className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
                value={m.roll}
                onChange={(e) => setMemberField(i, "roll", e.target.value)}
              >
                <option value="">Select roll number</option>
                {students
                  .filter((s) => String(s.roll) !== String(roll)) // exclude leader
                  .map((s) => (
                    <option key={s.roll} value={s.roll}>
                      {s.roll} {s.name ? ` - ${s.name}` : s.email ? ` - ${s.email}` : ""}
                    </option>
                  ))}
              </select>
            )}
            <input
              type="text"
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Full Name"
              value={m.name}
              onChange={(e) => setMemberField(i, "name", e.target.value)}
              readOnly
            />
            <input
              type="email"
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Email Address"
              value={m.email}
              onChange={(e) => setMemberField(i, "email", e.target.value)}
              readOnly
            />
          </div>
        ))}

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 bg-green-50 border border-green-200 p-2 rounded-lg text-sm">
            {message}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Creating...
            </>
          ) : (
            "Create Team (send invites)"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTeamForm;
