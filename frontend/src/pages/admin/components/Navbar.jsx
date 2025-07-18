import React from "react";
import { Colors, TextSize } from "../../../../utils/constants";

const Navbar = ({ userName, onLogout }) => {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1% 16px",
      backgroundColor: Colors.primary,
      color: "white",
      position: "fixed",
      width: "100vw",
      zIndex: 1000,
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    title: {
      fontSize: TextSize.primarySize,
      fontWeight: "bold",
    },
    logoutButton: {
      backgroundColor: "#222222",
      color: "white",
      border: "none",
      padding: "8px 16px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.toolbar}>
        <div style={styles.title}>{userName}</div>
        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
