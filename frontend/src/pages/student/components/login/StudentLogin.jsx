/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, MailCheck, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentLogin = () => {
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [updateProfilePopup, setUpdateProfilePopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

  const [name, setName] = useState("");
  const [roll, setRoll] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const loginData = { roll, password };
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        if (response.status === 203) {
          setName(data.name || "");
          setUpdateProfilePopup(true);
          setLoading(false);
          return;
        }

        sessionStorage.setItem("studentToken", data.data.token);
        sessionStorage.setItem("recipeCount", data.data.recipeCount);
        // sessionStorage.setItem("email", data.data.email);
        sessionStorage.setItem("roll", data.data.roll);
        navigate("/student/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword || newPassword.length < 6) {
      alert("Passwords do not match or are too short.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to change password.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password reset request sent!");
        setShowForgotPasswordPopup(false);
      } else {
        alert(data.message || "Error sending request.");
      }
    } catch (err) {
      alert("Error occurred while requesting password reset.");
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const profileData = {
        name,
        contact,
        address,
        role,
        roll,
      };
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully");
        setUpdateProfilePopup(false);
        setChangePasswordPopup(true);
      } else {
        alert(data.message || "Profile update failed");
      }
    } catch (error) {
      alert("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans px-4 bg-background text-foreground">
      {/* Themed background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#fcdfff] via-white to-[#c5d2ff] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      {/* back button */}
      <Button variant="link" className="absolute top-4 left-4" onClick={() => navigate("/members")}>
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      {/* Global ThemeToggle renders from App.jsx; no local toggle here */}

      <Card className="w-full max-w-md border border-border shadow-sm">
        <CardHeader className="text-center">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
            className="w-16 h-16 mx-auto rounded-full border border-border"
            alt="User"
          />
          <CardTitle className="text-2xl mt-2">Student Login</CardTitle>
          <CardDescription>Sign in to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            className="space-y-4"
          >
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="relative">
              <User className="absolute top-3 left-3 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Roll Number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-muted-foreground" size={18} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={() => setShowForgotPasswordPopup(true)}
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordPopup} onOpenChange={setChangePasswordPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
            <DialogDescription>Choose a strong password for your account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={changePassword} className="w-full">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Profile Dialog */}
      <Dialog open={updateProfilePopup} onOpenChange={setUpdateProfilePopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>Complete your profile to continue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Name"
              value={name}
              // onChange={(e) => setName(e.target.value)}
              readonly
            />
            <Input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leader">Team Leader</SelectItem>
                <SelectItem value="member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleProfileUpdate} className="w-full">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPasswordPopup} onOpenChange={setShowForgotPasswordPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MailCheck size={18} /> Forgot Password
            </DialogTitle>
            <DialogDescription>
              Enter your official email. Admin will verify and reset your password.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Enter email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleForgotPassword} className="w-full">
              Request Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentLogin;
