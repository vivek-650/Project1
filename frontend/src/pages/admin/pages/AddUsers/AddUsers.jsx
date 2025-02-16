import React, { useState } from "react";
import * as XLSX from "xlsx";

export const AddUsers = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    recipeCount: "",
  });
  const [users, setUsers] = useState(null);

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

  const createMultipleUser = async () => {
    try {
      const usersData = users;
      console.log("Users Data: ", usersData);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/admin/create-users`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(usersData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        console.log("Data :", data);
      } else {
        console.log("Error in create multiple users", data);
      }
    } catch (error) {
      console.log("Error during create multiple users api: ", error);
    }
  };

  const handleAddUser = () => {
    createUser();
    setUser({
      name: "",
      email: "",
      phone: "",
      recipeCount: "",
    });
  };

  const handleCreateMultipleUser = () => {
    createMultipleUser();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setUsers(jsonData);
      console.log(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Add Users</h1>
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
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
          <button type="button" onClick={handleAddUser}>
            Add
          </button>
        </form>
      </div>
      <div>
        <h3>Upload excel sheet of all users to create</h3>
        <input type="file" onChange={handleFileUpload} />
      </div>
      <div>
        <h2>Users in File</h2>
        {users && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td style={{ textAlign: "center" }}>{item.recipeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleCreateMultipleUser}>Create Users</button>
      </div>
    </div>
  );
};
