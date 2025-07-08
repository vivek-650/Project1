import { useState } from "react";
import Navbar from "./Navbar";
import { Colors } from "../../../../utils/constants";
import { Outlet, useNavigate } from "react-router-dom";

export const Layout = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "1",
      name: "All Users",
      link: "/dashboard/users",
    },
    {
      id: "2",
      name: "Add users",
      link: "/dashboard/add-users",
    },
    {
      id: "3",
      name: "Requests",
      link: "/dashboard/requests",
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
    navigate(`/supervisor${menu.link}`);
  };

  const handleLogout = () => {
    sessionStorage.clear("supervisorToken");
    navigate("/");
  };

  return (
    <div style={styles.main}>
      <Navbar userName={"Test Supervisor"} onLogout={handleLogout} />
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
