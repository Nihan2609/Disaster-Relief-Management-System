import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignZoneInfo = () => {
  const [zones, setZones] = useState([]);
  const [types, setTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zoneRes, typeRes, severityRes] = await Promise.all([
          axios.get("http://localhost:8800/disasterzone"),
          axios.get("http://localhost:8800/disastertype"),
          axios.get("http://localhost:8800/severitylevel"),
        ]);
        setZones(zoneRes.data);
        setTypes(typeRes.data);
        setSeverities(severityRes.data);
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/zone/assign-type", {
        zoneId: selectedZone,
        disasterTypeIds: selectedTypes,
      });
      await axios.post("http://localhost:8800/zone/assign-severity", {
        zoneId: selectedZone,
        severityId: selectedSeverity,
      });
      setMessage({ type: "success", text: "Zone updated successfully!" });
      setSelectedZone("");
      setSelectedTypes([]);
      setSelectedSeverity("");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to assign zone info" });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Assign Disaster Type & Severity
      </h2>

      {/* Toast Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white text-center ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Zone Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Zone</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition"
            >
              <option value="">-- Select Zone --</option>
              {zones.map((z) => (
                <option key={z.Zone_ID} value={z.Zone_ID}>
                  {z.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Disaster Types */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Disaster Types
            </label>
            <select
              multiple
              value={selectedTypes}
              onChange={(e) =>
                setSelectedTypes(
                  [...e.target.selectedOptions].map((o) => o.value)
                )
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition"
            >
              {types.map((t) => (
                <option key={t.Type_ID} value={t.Type_ID}>
                  {t.Type_Name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Hold Ctrl (Windows) or Command (Mac) to select multiple
            </p>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Severity Level
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition"
            >
              <option value="">-- Select Severity --</option>
              {severities.map((s) => (
                <option key={s.Severity_ID} value={s.Severity_ID}>
                  {s.Level}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
          >
            Assign
          </button>
        </form>
      )}
    </div>
  );
};

export default AssignZoneInfo;
