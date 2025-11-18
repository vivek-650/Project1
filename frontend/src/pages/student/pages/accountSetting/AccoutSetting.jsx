// import React from 'react'
import { useEffect, useState } from "react";

const AccoutSetting = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const email = sessionStorage.getItem("email");

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/user-details/${email}`,
        {
          method: "GET",
        }
      );
      // console.log("User details api response: ", response);
      if (response.ok) {
        const data = await response.json();
        // console.log("User Details: ", data[0]);
        setUser(data[0]);
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
    getUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>User Details</h1>
      <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Phone Number: {user?.phone}</p>
        <p>Account Status: {user?.isActive ? "Active" : "In Active"}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  );
};

export default AccoutSetting;
