import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "members") {
      navigate("/members");
    } else if (role === "notice") {
      navigate("/notice");
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
          onClick={() => handleRoleSelection("members")}
        >
          Members Area
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("notice")}
        >
          Notice
        </button>
      </div>
    </div>
  );
};

export default HomePage;
