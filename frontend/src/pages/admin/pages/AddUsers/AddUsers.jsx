import  { useState } from "react";
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
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#333",
    },
    formContainer: {
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    label: {
      display: "flex",
      flexDirection: "column",
      fontSize: "16px",
      color: "#555",
    },
    input: {
      padding: "8px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginTop: "5px",
    },
    button: {
      padding: "10px 15px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "black",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
    },
    uploadContainer: {
      marginBottom: "20px",
    },
    fileInput: {
      padding: "10px",
      fontSize: "14px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    tableHeader: {
      borderBottom: "2px solid #ddd",
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f2f2f2",
    },
    tableCell: {
      borderBottom: "1px solid #ddd",
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add Users</h1>
      <div style={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
          <label style={styles.label}>
            User Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter User Name"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Email:
            <input
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter User Email"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Phone:
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="Enter User Number"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Recipe Count:
            <input
              type="text"
              name="recipeCount"
              value={user.recipeCount}
              onChange={handleChange}
              placeholder="Enter Recipe Count"
              style={styles.input}
            />
          </label>
          <button type="button" onClick={handleAddUser} style={styles.button}>
            Add
          </button>
        </form>
      </div>
      <br />
      <hr />
      <br />
      <div style={styles.uploadContainer}>
        <h3>Upload excel sheet of all users to create</h3>
        <input type="file" onChange={handleFileUpload} style={styles.fileInput} />
      </div>
      <br />
      <div>
        <h2>Users in File</h2>
        {users && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Email</th>
                <th style={styles.tableHeader}>Phone No</th>
                <th style={styles.tableHeader}>Count</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={index}>
                  <td style={styles.tableCell}>{item.name}</td>
                  <td style={styles.tableCell}>{item.email}</td>
                  <td style={styles.tableCell}>{item.phone}</td>
                  <td style={{ ...styles.tableCell, textAlign: "center" }}>{item.recipeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleCreateMultipleUser} style={styles.button}>
          Create Users
        </button>
      </div>
    </div>
  );


};
