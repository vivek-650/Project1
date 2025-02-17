import { useEffect, useState } from "react";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/users`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.log("Error in get Users");
      }
    } catch (error) {
      console.log("Error during get Users: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const blockUser = async (email) => {
    try {
      const userData = { email: email };
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/block-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      console.log("Block user api response: ", response);

      const data = response.json();
      if (response.ok) {
        console.log("Block user data: ", data);
        getUsers();
        alert("User Blocked");
      } else {
        console.log("Error during block user: ", data.message);
      }
    } catch (error) {
      console.log("Error in block user api: ", error);
    }
  };

  const handleBlock = (email) => {
    blockUser(email);
  };
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      textAlign: 'center',
      color: '#333',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
    },
    noUsers: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#888',
    },
    userCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '',
    },
    blockButton: {
      padding: '8px 12px',
      backgroundColor: '#ff4d4d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Users</h1>
      {/* <hr /> */}
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={styles.noUsers}>
          <p>No Users Present</p>
        </div>
      ) : (
        users.map((item) => (
          <div key={item.id} style={styles.userCard}>
            <h3>Name: {item.name}</h3>
            <p>Email: {item.email}</p>
            <p>Phone: {item.phone}</p>
            <p>Recipe Count: {item.recipeCount}</p>
            <p>Status: {item.isActive ? "Active" : "Inactive"}</p>
            {item.isActive && (
              <button style={styles.blockButton} onClick={() => handleBlock(item.email)}>
                Block User
              </button>
            )}
            {/* <hr /> */}
          </div>
        ))
      )}
    </div>
  );
};

