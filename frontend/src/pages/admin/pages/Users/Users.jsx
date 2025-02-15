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
            <p>Status: {item.isActive ? "Active" : "Blocked"}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};
