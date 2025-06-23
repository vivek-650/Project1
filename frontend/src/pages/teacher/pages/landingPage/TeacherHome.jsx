// import React from 'react'

import { useNavigate } from "react-router-dom";

const TeacherHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      TeacherHome
      <button
        onClick={() => {
          navigate("/teacher/dashboard", {
            replace: true,
          });
        }}
      >
        Dashboard
      </button>
    </div>
  );
};

export default TeacherHome;
