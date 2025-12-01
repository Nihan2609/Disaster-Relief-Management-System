import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const VolunteerDashboard = () => {
  const [volunteer, setVolunteer] = useState(null);
  const [zone, setZone] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const volunteerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!volunteerId || volunteerId === "0") {
      setError("Volunteer not logged in or invalid ID.");
      setLoading(false);
      return;
    }

    const fetchVolunteerData = async () => {
      try {
        // Volunteer details
        const vRes = await axios.get(
          `http://localhost:8800/volunteer/${volunteerId}`
        );
        setVolunteer(vRes.data);

        // Assignment check
        const assignmentRes = await axios.get(
          `http://localhost:8800/volunteering/volunteer/${volunteerId}`
        );

        if (assignmentRes.data.length > 0) {
          const zoneId = assignmentRes.data[0].Zone_ID;

          // Zone info
          const zRes = await axios.get(
            `http://localhost:8800/disasterzone/${zoneId}`
          );
          setZone(zRes.data);

          // Resources
          const rRes = await axios.get(
            `http://localhost:8800/zone/${zoneId}/resources`
          );
          setResources(rRes.data);
        } else {
          setZone(null);
          setResources([]);
        }
      } catch (err) {
        console.error("Failed to load volunteer dashboard:", err);
        setError("Something went wrong while loading your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteerData();
  }, [volunteerId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- Loading & Error states ---
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-semibold">
        Loading dashboard...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <p className="bg-red-100 text-red-700 py-3 px-6 rounded-xl shadow-md font-semibold">
          {error}
        </p>
      </div>
    );

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col items-center p-6">
  {/* Welcome Heading */}
  <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-center drop-shadow-lg">
    👋 Welcome, {volunteer?.Name}!
  </h1>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
    {/* Profile Card */}
    <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-200">🧑‍💼 My Profile</h2>
      <p className="mb-2"><strong>Name:</strong> {volunteer.Name}</p>
      <p className="mb-2"><strong>Email:</strong> {volunteer.email}</p>
      <p className="mb-2"><strong>Contact:</strong> {volunteer.Contact_Info}</p>
      <p className="mb-2"><strong>Role:</strong> {volunteer.Role || "Volunteer"}</p>
    </div>

    {/* Zone & Resources */}
    <div className="bg-white text-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
      {zone ? (
        <>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 border-gray-200">📍 Assigned Zone</h2>
          <p className="mb-1"><strong>Zone Name:</strong> {zone.Name}</p>
          <p className="mb-1"><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-sm ${zone.Disaster_Status === 'active' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{zone.Disaster_Status}</span></p>
          <p className="mb-4"><strong>Last Updated:</strong> {new Date(zone.Last_Update).toLocaleString()}</p>

          <h2 className="text-2xl font-bold mt-6 mb-3 border-b pb-2 border-gray-200">📦 Available Resources</h2>
          {resources.length > 0 ? (
            <ul className="list-disc ml-6 space-y-1">
              {resources.map((r) => (
                <li key={r.Resource_ID} className="hover:underline transition-all duration-200">
                  <strong>{r.Resource_Type}</strong>: {r.Quantity} {r.Unit}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-600 font-medium">No resources available in this zone.</p>
          )}
        </>
      ) : (
        <div className="text-center text-yellow-400 font-semibold">
          ⚠️ You are not assigned to any zone yet. Please wait for the admin to assign you.
        </div>
      )}
    </div>
  </div>

  {/* Actions */}
  <div className="mt-10 flex flex-col lg:flex-row gap-6">
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-2xl shadow-lg font-bold text-lg transition-transform transform hover:scale-105"
    >
      🚪 Logout
    </button>
    <Link
      to="/report"
      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl shadow-lg font-bold text-lg transition-transform transform hover:scale-105"
    >
      📝 Submit a Report
    </Link>
  </div>
</div>

  );
};

export default VolunteerDashboard;
