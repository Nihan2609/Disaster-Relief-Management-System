import React, { useEffect, useState } from "react";
import axios from "axios";


const UnifiedZoneManagement = () => {
    const [zones, setZones] = useState([]);
    const [types, setTypes] = useState([]);
    const [severities, setSeverities] = useState([]);
    const [assignedZoneIds, setAssignedZoneIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedZone, setSelectedZone] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedSeverity, setSelectedSeverity] = useState("");

    // Load initial data
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [zoneInfoRes, typeRes, severityRes, assignedRes] = await Promise.all([
                    axios.get("http://localhost:8800/zone-info"),
                    axios.get("http://localhost:8800/disastertype"),
                    axios.get("http://localhost:8800/severitylevel"),
                    axios.get("http://localhost:8800/zones/assigned"),
                ]);
                setZones(zoneInfoRes.data);
                setTypes(typeRes.data);
                setSeverities(severityRes.data);
                setAssignedZoneIds(assignedRes.data.map(z => z.Zone_ID));
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedZone || selectedTypes.length === 0 || !selectedSeverity) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("http://localhost:8800/zone/assign-type", {
                zoneId: selectedZone,
                disasterTypeIds: selectedTypes,
            });

            await axios.post("http://localhost:8800/zone/assign-severity", {
                zoneId: selectedZone,
                severityId: selectedSeverity,
            });

            alert(" Zone assignment successful!");


            setSelectedZone("");
            setSelectedTypes([]);
            setSelectedSeverity("");


            const updatedZones = await axios.get("http://localhost:8800/zone-info");
            const updatedAssigned = await axios.get("http://localhost:8800/zones/assigned");
            setZones(updatedZones.data);
            setAssignedZoneIds(updatedAssigned.data.map(z => z.Zone_ID));
        } catch (err) {
            console.error("Assignment error:", err);
            alert("❌ Failed to assign disaster info.");
        }
    };

  

    if (loading) return <div className="zone-container">Loading zone data...</div>;

    return (
       <div className="max-w-5xl mx-auto p-6">
  {/* Zone Overview */}
  <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      📊 Disaster Zone Overview
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Zone Name</th>
            <th className="p-3 text-left">Last Update</th>
            <th className="p-3 text-left">Disaster Types</th>
            <th className="p-3 text-left">Severity</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone, idx) => (
            <tr
              key={zone.Zone_ID}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-blue-50 transition`}
            >
              <td className="p-3 font-medium text-gray-800">{zone.Zone_Name}</td>
              <td className="p-3 text-gray-600">
                {zone.Last_Updated
                  ? new Date(zone.Last_Updated).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="p-3 text-gray-700">
                {zone.Disaster_Types || "None"}
              </td>
              <td>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    zone.Severity_Level === "High"
                      ? "bg-red-100 text-red-700"
                      : zone.Severity_Level === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : zone.Severity_Level === "Low"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {zone.Severity_Level || "None"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Assign Form */}
  <div className="bg-white shadow-lg rounded-2xl p-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      🛠 Assign Disaster Type & Severity
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Zone */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Zone
        </label>
        <select
          id="zone-select"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Unassigned Zone</option>
          {zones
            .filter((z) => !assignedZoneIds.includes(z.Zone_ID))
            .map((z) => (
              <option key={z.Zone_ID} value={z.Zone_ID}>
                {z.Zone_Name}
              </option>
            ))}
        </select>
      </div>

      {/* Disaster Types */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Disaster Types
        </label>
        <select
          id="type-select"
          multiple
          value={selectedTypes}
          onChange={(e) =>
            setSelectedTypes(Array.from(e.target.selectedOptions, (o) => o.value))
          }
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
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

      {/* Severity */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Severity Level
        </label>
        <select
          id="severity-select"
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Severity</option>
          {severities.map((s) => (
            <option key={s.Severity_ID} value={s.Severity_ID}>
              {s.Level}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        ✅ Assign
      </button>
    </form>
  </div>
</div>

    );
};

export default UnifiedZoneManagement;
