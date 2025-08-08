// frontend/src/components/team/TeamRequests.jsx
import  { useEffect, useState } from "react";
import axios from "axios";
import { Users, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const TeamRequests = ({ onResponded }) => {
  const roll = sessionStorage.getItem("roll");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchInvites = async () => {
    if (!roll) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/team/requests/${roll}`
      );
      setInvites(res.data.invitations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const respond = async (teamId, action) => {
    setActionLoading((s) => ({ ...s, [teamId]: true }));
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/team/respond`, {
        roll,
        teamId,
        action,
      });
      onResponded?.();
      fetchInvites();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setActionLoading((s) => ({ ...s, [teamId]: false }));
    }
  };

  // Loading UI
  if (loading)
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg text-white flex items-center gap-3">
        <Loader2 className="animate-spin text-blue-400" /> Fetching invites...
      </div>
    );

  // Empty UI
  if (!invites.length)
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg text-gray-300 text-center">
        No pending invites.
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg text-white border border-gray-700">
      <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2 mb-5">
        <Users className="w-6 h-6" /> Team Invitations
      </h3>

      <div className="space-y-4">
        {invites.map((t) => (
          <div
            key={t.teamId}
            className="p-5 rounded-lg bg-white/5 backdrop-blur-md border border-gray-700 hover:border-blue-500 transition-all"
          >
            <div className="text-sm mb-1">
              From leader:{" "}
              <strong className="text-blue-400">{t.leaderRoll}</strong>
            </div>

            <div className="text-xs text-gray-300">
              Members:
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                {t.members.map((m) => (
                  <li key={m.roll}>
                    <span className="text-blue-300">{m.roll}</span> — {m.name} —{" "}
                    <span
                      className={
                        m.status === "accepted"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {m.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => respond(t.teamId, "accept")}
                disabled={actionLoading[t.teamId]}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg font-medium text-white shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {actionLoading[t.teamId] ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Accept
              </button>

              <button
                onClick={() => respond(t.teamId, "decline")}
                disabled={actionLoading[t.teamId]}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg font-medium text-white shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {actionLoading[t.teamId] ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRequests;
