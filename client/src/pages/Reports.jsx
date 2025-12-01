import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:8800/reports");
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load reports");
      setLoading(false);
    }
  };

  // Update report status
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await axios.put(`http://localhost:8800/reports/${reportId}`, {
        status: newStatus,
      });

      // Update state without losing other columns
      setReports((prev) =>
        prev.map((r) =>
          r.Report_ID === reportId ? { ...r, Status: newStatus } : r
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Delete a report
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.error("Failed to delete report:", err);
      alert("Failed to delete report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading)
    return <p className="text-center mt-6 text-gray-700">Loading reports...</p>;
  if (error)
    return (
      <p className="text-center mt-6 text-red-500 font-semibold">{error}</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        📝 Reports
      </h2>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-xl">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 text-gray-700">
            <tr>
              {[
                "Zone",
                "Title",
                "Description",
                "Type",
                "District",
                "Deaths",
                "Casualties",
                "Severity",
                "Status",
                "Created At",
                "Resolved At",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report.Report_ID}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="px-4 py-2">{report.Zone_Name || "N/A"}</td>
                <td className="px-4 py-2 font-medium">{report.Title}</td>
                <td className="px-4 py-2">{report.Description}</td>
                <td className="px-4 py-2">{report.Type || "N/A"}</td>
                <td className="px-4 py-2">{report.District || "N/A"}</td>
                <td className="px-4 py-2 text-red-600 font-semibold">
                  {report.Deaths}
                </td>
                <td className="px-4 py-2 text-yellow-600 font-semibold">
                  {report.Casualties}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white font-bold text-xs ${
                      report.Severity === "Critical"
                        ? "bg-red-600"
                        : report.Severity === "High"
                        ? "bg-orange-500"
                        : report.Severity === "Medium"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500"
                    }`}
                  >
                    {report.Severity || "Low"}
                  </span>
                </td>

                <td className="px-4 py-2">
                  <select
                    value={report.Status}
                    onChange={(e) =>
                      handleStatusChange(report.Report_ID, e.target.value)
                    }
                    className="border px-2 py-1 rounded-md focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>

                <td className="px-4 py-2">
                  {new Date(report.Created_At).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {report.Resolved_At
                    ? new Date(report.Resolved_At).toLocaleString()
                    : "N/A"}
                </td>

                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(report.Report_ID)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-md hover:scale-105 transition-transform"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
