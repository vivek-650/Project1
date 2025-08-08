import  { useState, useEffect } from "react";
import axios from "axios";

const LeaderFinalize = ({ initialTeam, onFinalized }) => {
  const roll = sessionStorage.getItem("roll");
  const [team, setTeam] = useState(initialTeam);
  const [loading, setLoading] = useState(false);

  // Polling function to refresh team data every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/team/status/${roll}`);
        if (res.data.team) setTeam(res.data.team);
      } catch (err) {
        console.error("Error fetching team status", err);
      }
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [roll]);

  const allAccepted = team?.members?.every((m) => m.status === "accepted");

  const finalize = async () => {
    if (!allAccepted) return alert("All members must accept before finalizing.");
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/team/finalize`, { leaderRoll: roll, teamId: team.teamId });
      alert("Team finalized successfully.");
      onFinalized?.();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!team) return <div>Loading team data...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <h4 className="text-lg font-semibold text-yellow-300">Finalize Team</h4>
      <div className="mt-2 text-sm">
        <div>
          Team ID: <strong>{team.teamId}</strong>
        </div>
        <div>Members:</div>
        <ul className="ml-5 list-disc text-xs">
          {team.members.map((m) => (
            <li key={m.roll}>
              {m.roll} - {m.name} — {m.status}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <button
          onClick={finalize}
          disabled={!allAccepted || loading}
          className="bg-yellow-500 px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Finalizing..." : "Finalize Team (lock members)"}
        </button>
        {!allAccepted && (
          <div className="text-red-400 mt-2 text-sm">Waiting for all members to accept.</div>
        )}
      </div>
    </div>
  );
};

export default LeaderFinalize;
