import { useEffect, useState } from "react";
import CreateTeamForm from "../teamFormation/CreateTeamForm";
import TeamRequests from "../teamFormation/TeamRequests";
import LeaderFinalize from "../teamFormation/LeaderFinalize";
import axios from "axios";
import { Users, Crown, Loader2, Shield, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TeamFormation = () => {
  const roll = sessionStorage.getItem("roll");
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [acceptedInvite, setAcceptedInvite] = useState(null);
  const [role, setRole] = useState(null);

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

  // If no team yet, check invitations and see if the current member has already accepted one
  useEffect(() => {
    if (!roll) return;
    if (team) {
      setAcceptedInvite(null);
      return;
    }
    let active = true;
    const fetchInvites = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/team/requests/${roll}`);
        const invites = Array.isArray(res.data?.invitations) ? res.data.invitations : [];
        // Find first invite where THIS student's status is accepted
        const mine = invites.find((t) =>
          t.members?.some((m) => m.roll === roll && m.status === "accepted")
        );
        if (active) setAcceptedInvite(mine || null);
      } catch (e) {
        console.error(e);
      }
    };
    fetchInvites();
    return () => {
      active = false;
    };
  }, [roll, refreshKey, team]);

  // Fetch current student's role (leader/member) using stored email
  useEffect(() => {
    const email = sessionStorage.getItem("roll");
    if (!email) return;
    let active = true;
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/user-details/${encodeURIComponent(roll)}`
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const me = list[0];
        if (active) setRole(me?.role || null);
      } catch (e) {
        console.error(e);
      } finally {
        // no-op
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Team Formation
        </h1>
        <p className="text-muted-foreground">Create or join a team to collaborate on projects</p>

        {/* refresh button */}
        <div className="mt-4">
          <button onClick={refresh} className="text-sm text-primary hover:underline">
            Refresh <RefreshCcw className="w-4 h-4 inline-block ml-1" />
          </button>
        </div>
      </div>

      {!roll && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">No roll found. Please login again.</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm">Loading your team information...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading &&
        !team &&
        !acceptedInvite &&
        (role === "leader" ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <CreateTeamForm onCreated={refresh} />
            <TeamRequests onResponded={refresh} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-1 gap-6">
            <TeamRequests onResponded={refresh} />
          </div>
        ))}

      {!loading && team && (
        <div className="space-y-6">
          {/* Team Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Your Team</span>
                </div>
                <Badge
                  variant={team.status === "pending" ? "secondary" : "default"}
                  className={
                    team.status === "pending"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border-emerald-200"
                  }
                >
                  {team.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Members Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.members?.map((member) => (
                  <Card key={member.roll} className="transition-all hover:shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.roll}</p>
                        </div>

                        {team.leaderRoll === member.roll && (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 shrink-0 ml-2"
                          >
                            <Crown className="w-3 h-3 mr-1" />
                            Leader
                          </Badge>
                        )}
                      </div>

                      {/* Status Badge */}
                      <Badge
                        variant="outline"
                        className={
                          member.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {member.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leader Finalize Section */}
          {team.leaderRoll === roll && team.status === "pending" && (
            <LeaderFinalize team={team} onFinalized={refresh} />
          )}
        </div>
      )}

      {/* If member has accepted an invitation but team is not attached yet, show finalize view (read-only) */}
      {!loading && !team && acceptedInvite && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Pending Team</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">PENDING</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                You&apos;ve accepted an invitation. Waiting for the leader to finalize the team.
              </div>
            </CardContent>
          </Card>

          <LeaderFinalize team={acceptedInvite} onFinalized={refresh} allowFinalize={false} />
        </div>
      )}
    </div>
  );
};

export default TeamFormation;
