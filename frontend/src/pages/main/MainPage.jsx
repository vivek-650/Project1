import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "administrator") {
      navigate("/administrator");
    } else if (role === "coordinator") {
      navigate("/coordinator");
    } else if (role === "supervisor") {
      navigate("/supervisor/login");
    } else if (role === "student") {
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
          onClick={() => handleRoleSelection("administrator")}
        >
          Administrator Login
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("coordinator")}
        >
          Coordinator Login
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("supervisor")}
        >
          Supervisor Login
        </button>
        <button
          style={buttonStyle}
          onClick={() => handleRoleSelection("student")}
        >
          Student Login
        </button>
      </div>
    </div>
  );
};

export default MainPage;
