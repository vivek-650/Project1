import { useNavigate } from "react-router-dom";
import "./MainPage.css"; // Importing CSS

const MainPage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    switch (role) {
      case "administrator":
        navigate("/administrator");
        break;
      case "coordinator":
        navigate("/coordinator");
        break;
      case "supervisor":
        navigate("/supervisor/login");
        break;
      case "student":
        navigate("/student/login");
        break;
      default:
        break;
    }
  };

  return (
    <div className="main-page-container">
      <div className="main-page-card">
        <h1 className="main-page-title">Select Your Role</h1>
        {/* <p className="main-page-subtitle">Login as the appropriate user type</p> */}
        <div className="main-page-button-group">
          <button
            className="main-page-button primary"
            onClick={() => handleRoleSelection("administrator")}
          >
            Administrator Login
          </button>
          <button
            className="main-page-button primary"
            onClick={() => handleRoleSelection("coordinator")}
          >
            Coordinator Login
          </button>
          <button
            className="main-page-button primary"
            onClick={() => handleRoleSelection("supervisor")}
          >
            Supervisor Login
          </button>
          <button
            className="main-page-button primary"
            onClick={() => handleRoleSelection("student")}
          >
            Student Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
