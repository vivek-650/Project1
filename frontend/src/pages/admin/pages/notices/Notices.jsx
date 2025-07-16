import { useState, useEffect } from "react";
import axios from "axios";
import "./Notices.css";

const Notices = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("student");
  const [document, setDocument] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/super-admin/notices`
      );
      setNotices(res.data);
    } catch (error) {
      console.error("Failed to fetch notices:", error.message);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !target) {
      return setMessage("All fields are required.");
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("target", target);
    if (document) {
      formData.append("document", document);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/super-admin/create-notice`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setTitle("");
      setDescription("");
      setTarget("student");
      setDocument(null);

      // Refresh notice list
      fetchNotices();
    } catch (error) {
      setMessage(error.response?.data?.error || "Error submitting notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notice-page">
      {/* --- Submission Section --- */}
      <section className="notice-form-container">
        <h2>Create a New Notice</h2>
        <form onSubmit={handleSubmit} className="notice-form">
          <label>
            Notice Subject:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Target Audience:
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Supervisor</option>
            </select>
          </label>

          <label>
            Upload Document (PDF):
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setDocument(e.target.files[0])}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Notice"}
          </button>
        </form>

        {message && <p className="notice-message">{message}</p>}
      </section>

      {/* --- Notices Display Section --- */}
      <section className="notice-display-container">
        <h2>All Notices</h2>
        {notices.length === 0 ? (
          <p>No notices available.</p>
        ) : (
          <ul className="notice-list">
            {notices.map((notice) => (
              <li key={notice.id} className="notice-item">
                <div className="notice-title">{notice.title}</div>
                <div className="notice-description">{notice.description}</div>
                <div className="notice-meta">
                  👤 Target: {notice.target} | 🕒{" "}
                  {notice.createdAt?._seconds
                    ? new Date(
                        notice.createdAt._seconds * 1000
                      ).toLocaleString()
                    : "Unknown"}
                </div>
                {notice.documentUrl && (
                  <a
                    href={notice.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notice-link"
                  >
                    View Document 📄
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Notices;
