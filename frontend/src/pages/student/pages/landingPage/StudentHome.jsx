import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Download } from "lucide-react";

const StudentHome = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch student notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/super-admin/notices/students`
        );
        setNotices(res.data || []);
        setFilteredNotices(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notices:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const filtered = notices.filter((n) =>
      n.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotices(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, notices]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredNotices.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedNotices = filteredNotices.slice(startIdx, startIdx + pageSize);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-[#ffffff] to-[#f5f7ff] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#307975] mb-6"> Student Notice Board</h1>

      {/* Search and Controls */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-md shadow-sm w-full sm:w-1/2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search notice by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full bg-transparent text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Show</label>
          <select
            className="px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Notice Table */}
      <div className="overflow-auto w-full max-w-6xl bg-white rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-[#45a195] text-white">
            <tr>
              <th className="px-4 py-3">Sl.No.</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 text-center ">Download</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">Loading notices...</td>
              </tr>
            ) : paginatedNotices.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">No notices found.</td>
              </tr>
            ) : (
              paginatedNotices.map((notice, idx) => (
                <tr
                  key={notice.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium">{startIdx + idx + 1}</td>
                  <td className="px-4 py-3">
                    {notice.createdAt?._seconds
                      ? new Date(notice.createdAt._seconds * 1000).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-3">{notice.title}</td>
                  <td className="px-4 py-3 text-center">
                    {notice.documentUrl ? (
                      <button
                        onClick={() => window.open(notice.documentUrl, "_blank")}
                        className="text-[#45a195] hover:underline flex items-center justify-center gap-1"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">No document</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center gap-2">
        <button
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === i + 1 ? "bg-[#343079] text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Back to Dashboard */}
      <button
        className="mt-10 px-6 py-2 bg-[#343079] hover:bg-[#3f3cc7] text-white rounded shadow-md"
        onClick={() => navigate("/student/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default StudentHome;
