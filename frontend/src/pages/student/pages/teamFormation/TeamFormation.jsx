// frontend/src/components/team/TeamFormation.jsx
import { useEffect, useState } from "react";
import CreateTeamForm from '../teamFormation/CreateTeamForm';
import TeamRequests from "../teamFormation/TeamRequests";
import LeaderFinalize from "../teamFormation/LeaderFinalize";
import axios from "axios";
import { Users, Crown, Loader2 } from "lucide-react";

const TeamFormation = () => {
  const roll = sessionStorage.getItem("roll"); // ensure set at login
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!roll) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/team/status/${roll}`)
      .then((res) => {
        setTeam(res.data.team);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [roll, refreshKey]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <h1 className="text-3xl font-semibold mb-6 text-blue-300 flex items-center gap-2">
        <Users className="w-7 h-7 text-blue-400" /> Team Formation
      </h1>

      {!roll && (
        <div className="p-4 bg-red-900 rounded">No roll found. Please login again.</div>
      )}

      {loading && (
        <div className="p-4 bg-gray-800 rounded flex items-center gap-3">
          <Loader2 className="animate-spin text-blue-400" /> Loading...
        </div>
      )}

      {!loading && !team && (
        <div className="grid md:grid-cols-2 gap-6">
          <CreateTeamForm onCreated={refresh} />
          <TeamRequests onResponded={refresh} />
        </div>
      )}

      {!loading && team && (
        <div className="space-y-6">
          {/* Team Info */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              Current Team{" "}
              <span
                className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  team.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}
              >
                {team.status}
              </span>
            </h2>

            {/* Members List */}
            <div className="grid md:grid-cols-2 gap-4">
              {team.members?.map((member) => (
                <div
                  key={member.roll}
                  className="p-4 rounded-lg bg-white/5 backdrop-blur-md border border-gray-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-lg text-blue-300">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-400">{member.roll}</p>
                    </div>

                    {team.leaderRoll === member.roll && (
                      <span
                        className="flex items-center gap-1 text-yellow-400 text-xs px-2 py-1 border border-yellow-500/30 rounded-full bg-yellow-500/10"
                        title="Team Leader"
                      >
                        <Crown className="w-4 h-4" /> Leader
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        member.status === "accepted"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leader Finalize Section */}
          {team.leaderRoll === roll && team.status === "pending" && (
            <LeaderFinalize team={team} onFinalized={refresh} />
          )}
        </div>
      )}
    </div>
  );
};

export default TeamFormation;
