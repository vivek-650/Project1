import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherHome.css"; // Create this CSS file for styling

const TeacherHome = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/super-admin/notices/teachers`
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

  return (
    <div className="teacher-home">
      <h1 className="teacher-header">Teacher Notices</h1>

      {loading ? (
        <p>Loading notices...</p>
      ) : (
        <ul className="teacher-notice-list">
          {notices.map((notice) => (
            <li
              key={notice.id}
              className="teacher-notice-item"
              onClick={() => {
                if (notice.documentUrl) {
                  window.open(notice.documentUrl, "_blank");
                } else {
                  alert("No document available for this notice.");
                }
              }}
            >
              <div className="teacher-notice-title">{notice.title}</div>
              <div className="teacher-notice-author">
                {notice.serialNo || "Unknown"}
              </div>
              <div className="teacher-notice-date">
                📅{" "}
                {notice.createdAt?._seconds
                  ? new Date(notice.createdAt._seconds * 1000).toLocaleString()
                  : "Unknown"}
              </div>
              <a
                href={notice.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            </li>
          ))}
        </ul>
      )}

      <button
        className="teacher-dashboard-button"
        onClick={() => {
          navigate("/supervisor/dashboard", { replace: true });
        }}
      >
        Dashboard
      </button>
    </div>
  );
};

export default TeacherHome;
