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
      name: "Dashboard",
      link: "/admin/dashboard",
    },
    {
      id: "2",
      name: "Users",
      link: "/admin/users",
    },
    {
      id: "3",
      name: "Requests",
      link: "/admin/requests",
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
    },
    rightContent: {
      backgroundColor: "red",
      height: "100%",
      width: '100%'
    },
  };

  const handleMenuClick = (menu) => {
    setActiveTab(menu.name);
    navigate(menu.link);
  };

  return (
    <div style={styles.main}>
      <Navbar userName={"TestAdmin"} />
      <div style={styles.leftMenu}>
        {menuItems.map((item) => (
          <div
            id={item.id}
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
