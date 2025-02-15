import React, { useEffect, useState } from "react";

const Recepies = () => {
  const [recpies, setRecpies] = useState([]);

  const getRecpies = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/user/recipes/user@example.com`,
        {
          method: "GET",
        }
      );
      // console.log("Get recpies api response: ", response);
      if (response.ok) {
        const data = await response.json();
        console.log("Recpies Data: ", data);
        setRecpies(data);
      } else {
        console.log("Get Recpie api error");
      }
    } catch (error) {
      console.log("Error in get Recpies: ", error);
    }
  };

  useEffect(() => {
    getRecpies();
  }, []);
  return (
    <div>
      <h1>All Recpies</h1>
      <hr />
      {recpies.length === 0 ? (
        <div>
          <h2>No Recpies Found</h2>
        </div>
      ) : (
        recpies.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>Ingredients: {item.ingredients}</p>
            <p>Instruction: {item.instructions}</p>
            <p>Explanation: {item.explanation}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Recepies;
