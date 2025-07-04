import React from "react";
import { useNavigate } from "react-router-dom";

const NoticePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "supervisor") {
      navigate("/supervisor/notice");
    } else if (role === "student") {
      navigate("/student/notice");
    } else if (role === "studentLogin") {
      navigate("/student/login");
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  };

  const buttonStyle = {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    width: "25%",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", justifyContent: "center", display: "flex" }}>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("supervisor")}
        >
          Notice For Supervisor
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("student")}
        >
          Notice for Students
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("studentLogin")}
        >
          Student Login
        </button>
      </div>
    </div>
  );
};

export default NoticePage;
