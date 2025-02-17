import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    try {
      const loginData = { name: name, password: password };
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
          setShowPopup(true);
          setLoading(false);
          return;
        }

        if (response.status === 201) {
          setError(data.message);
          setLoading(false);
          return;
        }

        sessionStorage.setItem("userToken", data.data.token);
        sessionStorage.setItem("recipeCount", data.data.recipeCount);
        sessionStorage.setItem("email", data.data.email);
        navigate("/user/dashboard");

        setLoading(false);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      setError("");
      login();
    }
  };

  const changePassword = async () => {
    setLoading(true);
    try {
      const userData = { name: name, newPassword: newPassword };
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(
          "Password changes successfully , now try logging in with new password"
        );
        navigate("/user");
      } else {
        console.log(
          "Error in user change password api response: ",
          data.message
        );
      }
    } catch (error) {
      console.log("Error in user change password api: ", error);
    }
    setLoading(false);
  };

  const handlePasswordChange = () => {
    let isValid = true;

    if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setNewPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    if (isValid) {
      changePassword();
      setName("");
      setPassword("");
      setShowPopup(false);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password reset request sent successfully.");
        setShowForgotPasswordPopup(false);
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the request.");
    }
  };

  return (
    <div style={styles.loginCard}>
      <div style={styles.brand}>
        <img
          style={styles.brandLogo}
          src="https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
          alt="User"
        />
        <h1>Welcome back!</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <form id="loginForm" style={styles.loginForm} onSubmit={handleVerify}>
        {error && (
          <div style={{ ...styles.error, textAlign: "center" }}>{error}</div>
        )}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Name
          </label>
          <input
            type="name"
            id="name"
            placeholder="Enter username provided by admin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter default password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {passwordError && <div style={styles.error}>{passwordError}</div>}
        </div>

        <div style={styles.rememberForgot}>
          <p
            onClick={() => setShowForgotPasswordPopup(true)}
            className="forgot-password"
          >
            Forgot password?
          </p>
        </div>

        <button type="submit" style={styles.loginBtn}>
          {loading ? "Loading..." : "Verify"}
        </button>
      </form>

      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2>Set New Password</h2>
            <div style={styles.formGroup}>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            {newPasswordError && (
              <div style={styles.error}>{newPasswordError}</div>
            )}
            <button onClick={handlePasswordChange} style={styles.loginBtn}>
              Submit
            </button>
          </div>
        </div>
      )}

      {showForgotPasswordPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2>Forgot Password</h2>
            <div style={styles.formGroup}>
              <label style={styles.ForgotLabel}>Enter company email for verification and request admin to grant permission </label>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                style={styles.input}
              />
            </div>
            <button
              onClick={() => handleForgotPassword(forgotPasswordEmail)}
              style={{ ...styles.loginBtn, width: "80%" }}
            >
              Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  loginCard: {
    maxWidth: "400px",
    margin: "1.5rem auto",
    padding: "2rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  brand: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2rem",
  },
  brandLogo: {
    width: "60px",
    height: "60px",
    marginBottom: "1rem",
    backgroundColor: "#ccc",
    borderRadius: "50%",
    border: "1px solid #dadada",
  },
  loginForm: { display: "flex", flexDirection: "column", width: "100%" },
  formGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  input: {
    width: "97%",
    height: "25px",
    marginTop: "0.5rem",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid grey",
  },
  label: { fontSize: "1.05rem" },
  error: { color: "red", fontSize: "0.875rem", marginTop: "0.5rem" },
  rememberForgot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    width: "100%",
    color: "blue",
    cursor: "pointer",
  },
  loginBtn: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: "25%",
    height: "50%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3rem",
    // justifyContent: "space-evenly",
  },
  ForgotLabel:{
    fontSize: "1.07rem",
    marginBottom: "1rem"
  },
};

export default UserLogin;
