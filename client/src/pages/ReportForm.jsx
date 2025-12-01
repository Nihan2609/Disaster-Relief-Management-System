import React, { useState, useEffect } from "react";
import axios from "axios";

const ReportForm = ({ userId, role }) => {
 // const [zones, setZones] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [type, setType] = useState("");
  const [district, setDistrict] = useState("");
  const [deaths, setDeaths] = useState(0);
  const [casualties, setCasualties] = useState(0);
  const [severity, setSeverity] = useState("Low");
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Load zones for dropdown
    //axios.get("http://localhost:8800/disasterzone").then(res => setZones(res.data));
    fetchReports();
  }, []);

  const fetchReports = () => {
    axios.get("http://localhost:8800/reports").then(res => setReports(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      donorId: role === "donor" ? userId : null,
      volunteerId: role === "volunteer" ? userId : null,
      zoneId: zoneId || null,
      title,
      description,
      type,
      district,
      deaths,
      casualties,
      severity
    };
    axios.post("http://localhost:8800/reports", payload)
      .then(() => {
        alert("Report submitted!");
        setTitle(""); setDescription(""); setZoneId(""); setType(""); setDistrict(""); setDeaths(0); setCasualties(0); setSeverity("Low");
        fetchReports();
      })
      .catch(err => alert("Failed: " + err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-6 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl transform hover:scale-105 transition-all duration-300">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          📝 Submit a Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block mb-2 font-medium text-gray-700">Title</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a concise title"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue or situation"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Type</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Flood, Fire, Earthquake"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">District</label>
            <input
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District name"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700">Deaths</label>
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                type="number"
                value={deaths}
                onChange={(e) => setDeaths(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium text-gray-700">Casualties</label>
              <input
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                type="number"
                value={casualties}
                onChange={(e) => setCasualties(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Severity</label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            🚀 Submit Report
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl mt-8 p-6 w-full max-w-4xl overflow-x-auto">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">All Reports</h3>
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3">Title</th>
              <th className="border p-3">Type</th>
              <th className="border p-3">District</th>
              <th className="border p-3">Deaths</th>
              <th className="border p-3">Casualties</th>
              <th className="border p-3">Severity</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.Report_ID} className="hover:bg-purple-50 transition-colors">
                <td className="border p-3 font-medium">{r.Title}</td>
                <td className="border p-3">{r.Type || "N/A"}</td>
                <td className="border p-3">{r.District || "N/A"}</td>
                <td className="border p-3">{r.Deaths}</td>
                <td className="border p-3">{r.Casualties}</td>
                <td className="border p-3">{r.Severity}</td>
                <td className={`border p-3 font-semibold ${r.Status === "resolved" ? "text-green-600" : r.Status === "in_progress" ? "text-yellow-600" : "text-red-600"}`}>
                  {r.Status.replace("_", " ").toUpperCase()}
                </td>
                <td className="border p-3">{new Date(r.Created_At).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportForm;
