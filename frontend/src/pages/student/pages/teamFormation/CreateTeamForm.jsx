// frontend/src/components/team/CreateTeamForm.jsx
import { useState } from "react";
import axios from "axios";
import { UserPlus, Loader2 } from "lucide-react";

const emptyMember = { roll: "", name: "", email: "" };

const CreateTeamForm = ({ onCreated }) => {
  const roll = sessionStorage.getItem("roll");
  const [members, setMembers] = useState([
    { ...emptyMember },
    { ...emptyMember },
    { ...emptyMember }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setMemberField = (idx, field, value) => {
    const copy = [...members];
    copy[idx] = { ...copy[idx], [field]: value };
    setMembers(copy);
  };

  const validate = () => {
    const rolls = members.map((m) => m.roll.trim());
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
    if (members.some((m) => !m.name.trim() || !m.email.trim())) {
      setError("All member names and emails are required.");
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

            <input
              type="text"
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Roll Number"
              value={m.roll}
              onChange={(e) => setMemberField(i, "roll", e.target.value)}
            />
            <input
              type="text"
              className="w-full mb-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full Name"
              value={m.name}
              onChange={(e) => setMemberField(i, "name", e.target.value)}
            />
            <input
              type="email"
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
              value={m.email}
              onChange={(e) => setMemberField(i, "email", e.target.value)}
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
