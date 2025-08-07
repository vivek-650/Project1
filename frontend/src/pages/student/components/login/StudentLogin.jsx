/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, MailCheck } from "lucide-react";

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
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (response.status === 203) {
          setUpdateProfilePopup(true);
          setLoading(false);
          return;
        }

        sessionStorage.setItem("studentToken", data.data.token);
        sessionStorage.setItem("recipeCount", data.data.recipeCount);
        sessionStorage.setItem("email", data.data.email);
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
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roll, newPassword }),
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotPasswordEmail }),
        }
      );

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
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

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
              placeholder="Roll Number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
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

      {/* Change Password Popup */}
      {changePasswordPopup && (
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

      {/* Update Profile Popup */}
      {updateProfilePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg space-y-3">
            <h3 className="text-lg font-bold text-gray-800">Update Profile</h3>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Role</option>
              <option value="leader">Team Leader</option>
              <option value="member">Team Member</option>
            </select>
            <button
              onClick={handleProfileUpdate}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
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
