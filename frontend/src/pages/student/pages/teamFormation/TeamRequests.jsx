import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2, Mail, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm">Loading your invitations...</span>
          </div>
        </CardContent>
      </Card>
    );

  // Empty UI
  if (!invites.length)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Team Invitations
          </CardTitle>
          <CardDescription>You have no pending team invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              When team leaders invite you, invitations will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Team Invitations
        </CardTitle>
        <CardDescription>
          {invites.length} pending invitation{invites.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {invites.map((t) => (
          <Card
            key={t.teamId}
            className="bg-muted/30"
          >
            <CardContent className="pt-6">
              {/* Leader Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Team Leader</p>
                  <p className="font-medium text-foreground">{t.leaderRoll}</p>
                </div>
              </div>

              {/* Members List */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Team Members
                </p>
                <div className="space-y-2">
                  {t.members.map((m) => (
                    <div
                      key={m.roll}
                      className="flex items-center justify-between p-3 rounded-lg bg-background border"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-foreground truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.roll}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={m.status === "accepted"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 ml-2"
                          : "bg-amber-50 text-amber-700 border-amber-200 ml-2"
                        }
                      >
                        {m.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => respond(t.teamId, "accept")}
                  disabled={actionLoading[t.teamId]}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                >
                  {actionLoading[t.teamId] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => respond(t.teamId, "decline")}
                  disabled={actionLoading[t.teamId]}
                  variant="outline"
                  className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                  size="sm"
                >
                  {actionLoading[t.teamId] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamRequests;
