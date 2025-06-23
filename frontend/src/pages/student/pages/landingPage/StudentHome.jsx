// import React from 'react'
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
  const navigate = useNavigate();
  return (
    <div>
      StudentHome
      <button
        onClick={() => {
          navigate({ pathname: "/student/dashboard", replace: true });
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default StudentHome;
