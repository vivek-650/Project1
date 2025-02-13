import React, { useState } from "react";

export const AddUsers = () => {
  const [users, setUsers] = useState([]);
  return (
    <div>
      <h1>Add Users</h1>
      <div>
        <form>
          <label>
            User Name
            <input type="text" />
          </label>
          <button>Add more</button>
          <button>Add All</button>
        </form>
      </div>
    </div>
  );
};
