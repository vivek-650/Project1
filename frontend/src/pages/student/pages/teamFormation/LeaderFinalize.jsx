import { useState, useEffect } from "react";
import axios from "axios";
import { Lock, Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LeaderFinalize = ({ team: initialTeam, onFinalized }) => {
  const roll = sessionStorage.getItem("roll");
  const [team, setTeam] = useState(initialTeam);
  const [loading, setLoading] = useState(false);

  // Polling function to refresh team data every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/team/status/${roll}`);
        if (res.data.team) setTeam(res.data.team);
      } catch (err) {
        console.error("Error fetching team status", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roll]);

  const allAccepted = team?.members?.every((m) => m.status === "accepted");
  const acceptedCount = team?.members?.filter((m) => m.status === "accepted").length || 0;
  const totalCount = team?.members?.length || 0;

  const finalize = async () => {
    if (!allAccepted) return alert("All members must accept before finalizing.");
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/team/finalize`, { 
        leaderRoll: roll, 
        teamId: team.teamId 
      });
      alert("Team finalized successfully!");
      onFinalized?.();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!team) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm">Loading team data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Finalize Your Team
        </CardTitle>
        <CardDescription>
          Lock your team roster once all members have accepted
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Team ID */}
        <div className="p-3 rounded-lg bg-muted/30 border">
          <p className="text-xs text-muted-foreground mb-1">Team ID</p>
          <p className="font-mono font-semibold text-sm text-foreground">{team.teamId}</p>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Acceptance Progress
            </span>
            <Badge
              variant="outline"
              className={allAccepted
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
              }
            >
              {acceptedCount} / {totalCount}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(acceptedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Members Status */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground mb-3">Member Status</p>
          {team.members.map((m) => (
            <div
              key={m.roll}
              className="flex items-center justify-between p-3 rounded-lg bg-background border"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    m.status === "accepted" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-foreground truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.roll}</p>
                </div>
              </div>
              {m.status === "accepted" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600 shrink-0 ml-2" />
              )}
            </div>
          ))}
        </div>

        {/* Warning Message */}
        {!allAccepted && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50">
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Waiting for Member Responses
                </p>
                <p className="text-xs text-amber-700">
                  All team members must accept before you can finalize.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Finalize Button */}
        <Button
          onClick={finalize}
          disabled={!allAccepted || loading}
          className="w-full disabled:opacity-50"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Finalizing Team...
            </>
          ) : allAccepted ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Finalize Team & Lock Roster
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Waiting for All Acceptances
            </>
          )}
        </Button>

        {allAccepted && (
          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50">
            <div className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-900 mb-1">
                  Ready to Finalize!
                </p>
                <p className="text-xs text-emerald-700">
                  All members have accepted. Click above to lock your team roster.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderFinalize;
