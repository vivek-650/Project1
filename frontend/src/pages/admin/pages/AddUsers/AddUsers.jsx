import React, { useState } from "react";

export const AddUsers = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    recipeCount: "",
  });

  // {
  //   "name": "User1",
  //   "email": "dummy@gmail.com",
  //   "phone": 1234567890,
  //   "isActive": true,
  //   "recipeCount": 10
  // }

  const createUser = async () => {
    try {
      const userData = user;
      console.log("User Data: ", userData);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/create-user`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(userData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        console.log("Data :", data);
      } else {
        console.log("Error in create user");
      }
    } catch (error) {
      console.log("Error during create user: ", error);
    }
  };

  const handleAddUser = () => {
    createUser({
      name: "",
      email: "",
      phone: "",
      recipeCount: "",
    });
    setUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Add Users</h1>
      <div>
        <form
          // style={{ display: "flex", flexDirection: "row",}}
          onSubmit={(e) => e.preventDefault()}
        >
          <label>
            User Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter User Name"
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter User Email"
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Enter User Number"
            />
          </label>
          <label>
            Recipe Count:
            <input
              type="text"
              name="recipeCount"
              value={user.recipeCount}
              onChange={handleChange}
              placeholder="Enter Recipe Count"
            />
          </label>
          {/* <button type="button">Add more</button> */}
          <button type="button" onClick={handleAddUser}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};
