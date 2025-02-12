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
      link: "/user/recepies",
    },
    {
      id: "2",
      name: "Drafts",
      link: "/user/drafts",
    },
    {
      id: "3",
      name: "uploaded",
      link: "/user/uploaded",
    },
    {
      id: "4",
      name: "Add new recepie",
      link: "/user/new-recepie",
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
      <Navbar userName={"TestUser"} />
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
