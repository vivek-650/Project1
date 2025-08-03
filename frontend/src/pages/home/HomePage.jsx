import { useNavigate } from "react-router-dom";
import "./HomePage.css"; // Importing the new CSS
// import Ellipse from "../../../public/assets/Ellipse 2.svg"; // Adjust the path as necessary
import MemberAreaImage from "../../../public/assets/MemberAreaImage.png"; // Adjust the path as necessary
import NoticeImage from "../../../public/assets/NoticeImage.png"; // Adjust the path as necessary
const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "members") {
      navigate("/members");
    } else if (role === "notice") {
      navigate("/notice");
    }
  };

  return (
    <div className="home-page-container ">
      <div className="ellipse"></div>
      <h1 className="home-page-heading">project management system</h1>
      <p className="home-page-description text-red-500">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,
      </p>
      <div className="home-page-card-group">
        <div className="home-page-card">
          <img src={MemberAreaImage} alt="Members" className="home-page-avatar" />
          <p className="home-page-card-label">Members Area</p>
          <p className="home-page-card-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatem praesentium.</p>
          <button className="home-page-button" onClick={() => handleRoleSelection("members")}>
            <span className="home-page-button-text">Get Started</span>
          </button>
        </div>

        <div className="home-page-card">
          <img src={NoticeImage} alt="Notice" className="home-page-avatar" />
          <p className="home-page-card-label">Notice</p>
          <p className="home-page-card-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae voluptatem.</p>
          <button className="home-page-button" onClick={() => handleRoleSelection("members")}>
            <span className="home-page-button-text">Get Started</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
