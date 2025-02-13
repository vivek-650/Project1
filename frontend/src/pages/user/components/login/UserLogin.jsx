import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email format");
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
      setShowPopup(true);
    }
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
      sessionStorage.setItem("userToken", "UserToken001")
      setShowPopup(false);
      alert("Password successfully updated!");
      navigate("/user/dashboard");
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
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter username provided by admin"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          {emailError && <div style={styles.error}>{emailError}</div>}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Default Password
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

        <button type="submit" style={styles.loginBtn}>
          Verify
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
    width: "300px",
    textAlign: "center",
  },
};

export default UserLogin;
