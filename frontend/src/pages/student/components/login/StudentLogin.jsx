/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, MailCheck } from "lucide-react";

const StudentLogin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (res.status === 203) {
          setShowPopup(true);
          return;
        }
        if (res.status === 201) {
          setError(data.message);
          return;
        }

        sessionStorage.setItem("userToken", data.data.token);
        sessionStorage.setItem("recipeCount", data.data.recipeCount);
        sessionStorage.setItem("email", data.data.email);
        navigate("/user/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword || newPassword.length < 6) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, newPassword }),
      });

      if (res.ok) {
        alert("Password changed successfully!");
        setShowPopup(false);
        setName("");
        setPassword("");
        navigate("/user");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Change password error:", err);
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

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fcdfff] via-white to-[#c5d2ff] font-sans px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-blue-100 backdrop-blur-md bg-opacity-90">
        <div className="text-center mb-6">
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
            className="w-16 h-16 mx-auto rounded-full border border-blue-300"
            alt="User"
          />
          <h2 className="text-2xl font-semibold mt-4 text-gray-800">Student Login</h2>
          <p className="text-sm text-gray-500">Sign in to your dashboard</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); login(); }} className="space-y-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-right text-sm text-blue-500 cursor-pointer" onClick={() => setShowForgotPasswordPopup(true)}>
            Forgot password?
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-semibold"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>

      {/* New Password Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Set New Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />
            <button
              onClick={changePassword}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <MailCheck size={20} /> Forgot Password
            </h3>
            <p className="text-sm mb-3 text-gray-600">
              Enter your official email. Admin will verify and reset your password.
            </p>
            <input
              type="email"
              placeholder="Enter email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Request Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLogin;
