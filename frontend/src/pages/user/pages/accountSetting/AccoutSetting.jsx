// import React from 'react'
import { useEffect, useState } from "react";

const AccoutSetting = () => {
    
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);
    
    const getUserDetails = async () => {
        try {
            const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/user/user-details/:email`,
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
    getUserDetails();
    }, []);
    
  return (
    <div>
        
    </div>
  )
}

export default AccoutSetting