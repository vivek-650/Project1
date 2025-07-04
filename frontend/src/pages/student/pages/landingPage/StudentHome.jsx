import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentHome.css";

const StudentHome = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/super-admin/notices/students`
        );
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);
  console.log(notices);
  return (
    <div className="student-home">
      <h1 className="header">Student Notices</h1>

      {loading ? (
        <p>Loading notices...</p>
      ) : (
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice.id} className="notice-item">
              <div className="notice-title">{notice.title}</div>
              <div className="notice-description">{notice.serialNo}</div>
              <div className="notice-date">
                📅{" "}
                {notice.createdAt?._seconds
                  ? new Date(notice.createdAt._seconds * 1000).toLocaleString()
                  : "Unknown"}
              </div>
              <button
                onClick={() => {
                  if (notice.documentUrl) {
                    window.open(notice.documentUrl, "_blank");
                  } else {
                    alert("No document available for this notice.");
                  }
                }}
              >
                Link
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        className="dashboard-button"
        onClick={() => {
          navigate("/student/dashboard", { replace: true });
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default StudentHome;
