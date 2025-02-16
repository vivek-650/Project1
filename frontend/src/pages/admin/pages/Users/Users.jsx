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

  return (
    <div>
      <h1>All Users</h1>
      <hr />
      {loading ? (
        <div>Loading...</div>
      ) : users.length === 0 ? (
        <div>
          <p>No Users Present</p>
        </div>
      ) : (
        users.map((item) => (
          <div key={item.id}>
            <h3>Name: {item.name}</h3>
            <p>Email: {item.email}</p>
            <p>Phone: {item.phone}</p>
            <p>Recipe Count: {item.recipeCount}</p>
            <p>Status: {item.isActive ? "Active" : "Inactive"}</p>
            {item.isActive && (
              <button onClick={() => handleBlock(item.email)}>
                Block User
              </button>
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};
