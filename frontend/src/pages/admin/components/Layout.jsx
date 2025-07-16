import { useState } from "react";
import Navbar from "./Navbar";
import { Colors } from "../../../../utils/constants";
import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "2",
      name: "Notices",
      link: "notices",
    },
    {
      id: "3",
      name: "Students",
      link: "students",
    },
    {
      id: "4",
      name: "Projects",
      link: "projects",
    },
    {
      id: "5",
      name: "Supervisors",
      link: "supervisors",
    },
  ];

  const styles = {
    main: {
      height: "100%",
      width: "100%",
    },
    leftMenu: {
      position: "fixed",
      left: 0,
      backgroundColor: Colors.secondary,
      width: "10%",
      height: "100%",
      paddingTop: "5%",
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
    navigate(`/coordinator/dashboard/${menu.link}`);
  };

  const handleLogout = () => {
    sessionStorage.clear("coordinatorToken");
    navigate("/");
  };

  return (
    <div style={styles.main}>
      <Navbar userName={"Test Coordinator"} onLogout={handleLogout} />
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
