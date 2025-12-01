import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    zones: 0,
    volunteers: 0,
    requests: 0,
    resources: 0,
    recentZones: []
  });
  const [volunteers, setVolunteers] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [donations, setDonations] = useState([]);

    const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zones, volunteers, requests, resources] = await Promise.all([
          axios.get("http://localhost:8800/disasterzone"),
          axios.get("http://localhost:8800/volunteer"),
          axios.get("http://localhost:8800/request"),
          axios.get("http://localhost:8800/resource")
        ]);
        setSummary({
          zones: zones.data.length,
          volunteers: volunteers.data.length,
          requests: requests.data.length,
          resources: resources.data.length,
          recentZones: zones.data.slice(-3).reverse()
        });
        setVolunteers(volunteers.data);
        setZonesList(zones.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8800/assignments")
      .then(res => setAssignments(res.data))
      .catch(err => console.error("Error fetching assignments:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8800/donation")
      .then(res => setDonations(res.data))
      .catch(err => console.error("Error fetching donations:", err));
  }, []);

  const assignVolunteerToZone = async () => {
    if (!selectedVolunteer || !selectedZone) {
      alert("Please select both a volunteer and a zone.");
      return;
    }
    try {
      await axios.put(`http://localhost:8800/volunteer/${selectedVolunteer}/assign-zone`, { Zone_ID: selectedZone });
      alert("Volunteer assigned successfully!");
      setSelectedVolunteer("");
      setSelectedZone("");
      const updatedAssignments = await axios.get("http://localhost:8800/assignments");
      setAssignments(updatedAssignments.data);
    } catch (err) {
      alert("Failed to assign volunteer.");
      console.error(err);
    }
  };

  const handleDeleteAssignment = async (volunteerId, zoneId) => {
    try {
      await axios.delete("http://localhost:8800/volunteering", {
        data: { Volunteer_ID: volunteerId, Zone_ID: zoneId }
      });
      alert("Assignment removed!");
      const updated = await axios.get("http://localhost:8800/assignments");
      setAssignments(updated.data);
    } catch (err) {
      console.error(err);
      alert("Error removing assignment.");
    }
  };

  return (
<div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
  {/* Sidebar */}
  <aside className="w-72 bg-white/90 backdrop-blur-md shadow-xl p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Quick Navigation</h2>

      {/* Sections */}
      <div className="space-y-6">
        {/* Management Section */}
        <div>
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">Manage Body</h3>
          <nav className="flex flex-col gap-2">
            {[
              { to: "/addZone", label: "Add Zone", icon: "📍" },
              { to: "/addVolunteer", label: "Add Volunteer", icon: "🧑‍💼" },
              { to: "/addRequest", label: "Add Request", icon: "📄" },
              { to: "/addResource", label: "Add Resource", icon: "📦" },
              { to: "/addcenter", label: "Add Relief Center", icon: "🏥" },
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-100 hover:text-blue-600 transition"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Management Section 2 */}
        <div>
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">Manage Units </h3>
          <nav className="flex flex-col gap-2">
            {[
              { to: "/disasterZone", label: "Manage Zones", icon: "🌐" },
              { to: "/volunteer", label: "Manage Volunteers", icon: "🧑‍🤝‍🧑" },
              { to: "/resource", label: "Manage Resources", icon: "📦" },
              { to: "/request", label: "Manage Requests", icon: "📝" },
              { to: "/center", label: "Manage Centers", icon: "🏨" },
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-green-100 hover:text-green-600 transition"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Operations Section */}
        <div>
          <h3 className="text-gray-500 uppercase text-sm font-semibold mb-2">Operations</h3>
          <nav className="flex flex-col gap-2">
            {[
              { to: "/distribute", label: "Distribute Donations", icon: "🎁" },
              { to: "/unfiled", label: "Assign Zones", icon: "📌" },
              { to: "/reports", label: "View Reports", icon: "📊" },
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-purple-100 hover:text-purple-600 transition"
              >
                <span>{icon}</span> {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition flex items-center justify-center gap-2"
    >
      🔒 Logout
    </button>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-8 space-y-10">
    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-8">
       DRMS Admin Dashboard
    </h1>

    {/* Summary Cards */}
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { key: "zones", label: "Disaster Zones", color: "from-indigo-500 to-teal-400" },
        { key: "volunteers", label: "Volunteers", color: "from-blue-500 to-indigo-400" },
        { key: "requests", label: "Requests", color: "from-emerald-500 to-teal-400" },
        { key: "resources", label: "Resources", color: "from-orange-500 to-yellow-400" },
      ].map(({ key, label, color }) => (
        <div
          key={key}
          className={`bg-gradient-to-r ${color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition`}
        >
          <h2 className="text-4xl font-extrabold">{summary[key]}</h2>
          <p className="text-lg">{label}</p>
        </div>
      ))}
    </section>

    {/* Volunteer Assignments */}
    <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🙋 Volunteer Assignments</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No volunteers assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Volunteer ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Skill</th>
                <th className="p-3">Assigned Zone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition border-b last:border-0"
                >
                  <td className="p-3">{a.Volunteer_ID}</td>
                  <td className="p-3">{a.Volunteer_Name}</td>
                  <td className="p-3">{a.Skill}</td>
                  <td className="p-3">{a.Zone_Name}</td>
                  <td className="p-3">{a.Disaster_Status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteAssignment(a.Volunteer_ID, a.Zone_ID)}
                      className="text-red-500 hover:underline"
                    >
                      ❌ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

    {/* Assign Volunteer */}
    <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📌 Assign Volunteer to Zone</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={selectedVolunteer}
          onChange={(e) => setSelectedVolunteer(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-1/3 shadow-sm focus:ring focus:ring-blue-300"
        >
          <option value="">Select Volunteer</option>
          {volunteers
            .filter(v => !assignments.some(a => a.Volunteer_ID === v.Volunteer_ID))
            .map(v => (
              <option key={v.Volunteer_ID} value={v.Volunteer_ID}>
                {v.Name} (ID: {v.Volunteer_ID})
              </option>
            ))}
        </select>

        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border p-3 rounded-lg w-full md:w-1/3 shadow-sm focus:ring focus:ring-green-300"
        >
          <option value="">Select Zone</option>
          {zonesList.map(z => (
            <option key={z.Zone_ID} value={z.Zone_ID}>
              {z.Name} (ID: {z.Zone_ID})
            </option>
          ))}
        </select>

        <button
          onClick={assignVolunteerToZone}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          ✅ Assign
        </button>
      </div>
    </section>

    {/* Recent Zones */}
    <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow space-y-2">
      <h2 className="text-xl font-bold text-gray-800">🕒 Recent Disaster Zone Updates</h2>
      <ul className="list-disc pl-6 space-y-1">
        {summary.recentZones.length === 0 ? (
          <li className="text-gray-500">No recent updates available.</li>
        ) : (
          summary.recentZones.map(zone => (
            <li key={zone.Zone_ID} className="text-gray-700">
              <strong>{zone.Name}</strong> – {zone.Disaster_Status} (
              {new Date(zone.Last_Update).toLocaleDateString()})
            </li>
          ))
        )}
      </ul>
    </section>

    {/* Donations */}
    <section className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow space-y-2">
      <h2 className="text-xl font-bold text-gray-800">💝 Donor Contributions</h2>
      {donations.length === 0 ? (
        <p className="text-gray-500">No donations recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Donor Name</th>
                <th className="p-3">Contact Info</th>
                <th className="p-3">Resource Type</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Donation Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="p-3">{d.Donor_Name || "Anonymous"}</td>
                  <td className="p-3">{d.Contact_Info || "N/A"}</td>
                  <td className="p-3">{d.Resource_Type || "N/A"}</td>
                  <td className="p-3">{d.Quantity}</td>
                  <td className="p-3">{new Date(d.Donation_Date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </main>
</div>

  );
};

export default Home;
