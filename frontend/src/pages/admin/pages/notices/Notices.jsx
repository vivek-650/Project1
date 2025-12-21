/*eslint-disable*/
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, FileText } from "lucide-react";
import { toast } from "react-fox-toast";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("Undefiend");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/super-admin/notices`);
      setNotices(res.data);
    } catch (err) {
      toast.error("Failed to fetch notices.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !target) return toast.error("All fields are required.");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("target", target);
    if (document) formData.append("document", document);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/super-admin/create-notice`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message || "Notice created!");
      setFormOpen(false);
      setTitle("");
      setDescription("");
      setTarget("student");
      setDocument(null);
      fetchNotices();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Error creating notice.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen font-sans text-gray-800 p-10">
      {/* Header + Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Notices Overview</h2>
        <input
          type="text"
          placeholder="Search notices..."
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3">Notice-id</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Notice Type</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Document</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice, index) => (
              <tr key={notice.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{notice.serialNo}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{notice.title}</td>
                <td className="px-6 py-4 capitalize">{notice.target}</td>
                <td className="px-6 py-4">
                  {notice.createdAt?._seconds
                    ? new Date(notice.createdAt._seconds * 1000).toLocaleDateString()
                    : "Unknown"}
                </td>
                <td className="px-6 py-4">
                  {notice.documentUrl ? (
                    <a
                      href={notice.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" /> View PDF
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
            {filteredNotices.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Notice Button */}
      <button
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 hover:shadow-xl transition"
      >
        <Plus />
      </button>

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-white/10 bg-opacity-20 backdrop-blur-[2px] flex justify-center items-center z-50 px-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-200">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Create New Notice</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Notice Subject</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload PDF (optional)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setDocument(e.target.files[0])}
                  className="mt-1 text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg shadow hover:bg-primary/90 hover:shadow-md transition"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Notice"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
