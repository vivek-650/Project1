import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = (e) => {
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
      sessionStorage.setItem("adminToken", "AdminToken001");
      alert("Login successful!");
      navigate("/admin/dashboard");
    }
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
      marginBottom: ".5rem",
    },
    brandLogo: {
      width: "100px",
      height: "100px",
      marginBottom: "0rem",
      backgroundColor: "#ccc",
      borderRadius: "50%",
    },
    loginForm: { display: "flex", flexDirection: "column", width: "100%" },
    formGroup: {
      marginBottom: ".5rem",
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
    },
    loginBtn: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "black",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    signupLink: { textAlign: "center", marginTop: "2rem" },
  };

  return (
    <div style={styles.loginCard}>
      <div style={styles.brand}>
        <img
          style={styles.brandLogo}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9WDX7JlmoXx1-KXqPeJAwiS0xWGDmjBEWw&s"
          alt="logo"
        />
        <h1>Welcome back!</h1>
        <p>Enter your credentials to access your account</p>
      </div>

      <form id="loginForm" style={styles.loginForm} onSubmit={handleLogin}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter username"
            autoComplete="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <div style={styles.error}>{emailError}</div>}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div style={styles.error}>{passwordError}</div>}
        </div>

        {/* <div style={styles.rememberForgot}>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div> */}

        <button type="submit" style={styles.loginBtn} id="loginButton">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
