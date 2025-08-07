import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Download, Calendar } from "lucide-react";

const TeacherHome = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/super-admin/notices/teachers`
        );
        setNotices(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setFiltered(
      notices.filter((n) =>
        n.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, notices]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-[#ffffff] to-[#f5f7ff] px-6 py-10">
      <h1 className="text-3xl font-bold text-[#4F46E5] mb-6">Teacher Notice Board</h1>

      {/* Search + Entry Size Selector */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center border px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 w-full sm:w-1/2">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search notice title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full text-sm bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Show</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 text-sm rounded-md border border-gray-300 bg-white"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Notices Table */}
      <div className="overflow-auto w-full max-w-6xl bg-white rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-[#4F46E5] text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3 text-center">Download</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">Loading notices...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">No notices found.</td>
              </tr>
            ) : (
              paginated.map((notice, idx) => (
                <tr
                  key={notice.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 font-medium">{startIdx + idx + 1}</td>
                  <td className="px-4 py-3 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {notice.createdAt?._seconds
                      ? new Date(notice.createdAt._seconds * 1000).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-3">{notice.title}</td>
                  <td className="px-4 py-3 text-center">
                    {notice.documentUrl ? (
                      <button
                        onClick={() => window.open(notice.documentUrl, "_blank")}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === i + 1 ? "bg-[#4F46E5] text-white" : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Go to Dashboard */}
      <button
        onClick={() => navigate("/supervisor/dashboard", { replace: true })}
        className="mt-8 px-6 py-2 bg-[#4F46E5] hover:bg-[#3f3cc7] text-white rounded shadow-md"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default TeacherHome;
