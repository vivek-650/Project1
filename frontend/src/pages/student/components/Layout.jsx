import { useState } from "react";
// import Navbar from "../Navbar";
import { Colors } from "../../../../utils/constants";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export const Layout = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "1",
      name: "All Recepies",
      link: "recepies",
    },
    {
      id: "2",
      name: "Drafts",
      link: "drafts",
    },
    {
      id: "3",
      name: "uploaded",
      link: "uploaded",
    },
    {
      id: "4",
      name: "Add new recepie",
      link: "new-recepie",
    },
    {
      id: "5",
      name: "User account setting",
      link: "user-setting",
    },
    
    {
      id: "6",
      name: "Team Formation",
      link: "team-formation",
    },
  ];

  const styles = {
    main: {
      height: "100%",
      width: "100%",
    },
    leftMenu: {
      position: "absolute",
      left: 0,
      backgroundColor: Colors.secondary,
      width: "10%",
      height: "100%",
    },
    menuItems: {
      padding: "10%",
      cursor: "pointer",
    },
    rightContent: {
      position: "absolute",
      left: "10%",
      height: "100%",
      width: "90%",
    },
  };

  const handleMenuClick = (menu) => {
    setActiveTab(menu.name);
    navigate(`/student/dashboard/${menu.link}`);
  };

  const handleLogout = () => {
    sessionStorage.clear("studentToken");
    navigate("/student/login");
  };

  return (
    <div style={styles.main}>
      <Navbar userName={"TestUser"} onLogout={handleLogout} />
      <div style={styles.leftMenu}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.menuItems,
              backgroundColor:
                activeTab === item.name ? Colors.tertiary : "inherit",
            }}
            onClick={() => handleMenuClick(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div style={styles.rightContent}>
        <Outlet />
      </div>
    </div>
  );
};
