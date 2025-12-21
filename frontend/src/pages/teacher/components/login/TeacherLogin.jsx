import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Mail, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const handleLogin = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/supervisor/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();
        sessionStorage.setItem("supervisorToken", data.token);
        alert("Login successful!");
        navigate("/supervisor/dashboard");
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans bg-background text-foreground">
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 flex items-center gap-2 z-20 px-3 py-1 rounded-full shadow border border-border
          bg-white/95 text-black hover:bg-white dark:bg-slate-800/95 dark:text-white dark:hover:bg-slate-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors"
        onClick={() => navigate("/")}
        type="button"
        aria-label="Back to Home"
        style={{
          borderWidth: 2,
          borderColor: "rgba(0,0,0,0.12)",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
        }}
      >
        <ArrowLeft size={20} className="" />
        <span className="font-semibold text-sm">Back</span>
      </button>
      {/* Themed background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#cbd8ff] via-white to-[#ffcffa] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      {/* Global ThemeToggle renders from App.jsx; no local toggle here */}

      <Card className="w-full max-w-md border border-border shadow-sm p-6">
        <CardHeader className="items-center text-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9WDX7JlmoXx1-KXqPeJAwiS0xWGDmjBEWw&s"
            alt="Logo"
            className="w-16 h-16 rounded-full border border-border"
          />
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
          <CardDescription>Sign in to your supervisor account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 text-muted-foreground" size={18} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <Button type="submit" onClick={handleLogin} className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherLogin;
