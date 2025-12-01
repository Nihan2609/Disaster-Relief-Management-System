import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;

        const userRes = await axios.get(`http://localhost:8800/donor/${userId}`);
        setUser(userRes.data);

        const donationRes = await axios.get(`http://localhost:8800/donor/${userId}/donations`);
        setDonations(donationRes.data);
      } catch (err) {
        console.error("Failed to load user dashboard", err);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xl font-semibold">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-indigo-600 text-white flex flex-col items-center p-6">
      {/* Welcome */}
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 drop-shadow-lg text-center">
        👋 Welcome, {user.Is_Anonymous ? "Valued Donor 🙏" : user.Name}!
      </h1>

      {/* Donations Card */}
      <div className="w-full max-w-4xl bg-white text-gray-800 rounded-3xl shadow-2xl p-8 mb-8 transform hover:scale-105 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-gray-200">💝 Your Donations</h2>
        {donations.length > 0 ? (
          <ul className="space-y-3">
            {donations.map((d) => (
              <li
                key={d.Donation_ID}
                className="bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <p className="text-lg">
                  <strong>{d.Resource_Type}</strong> – {d.Quantity} Unit
                </p>
                <p className="text-sm text-gray-500">
                  Donated on: {new Date(d.Donation_Date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">You haven’t made any donations yet. 💬</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        <button
          onClick={() => navigate("/donate")}
          className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-2xl shadow-lg font-bold text-lg transition-transform transform hover:scale-105"
        >
          🎁 Make a Donation
        </button>

        <button
          onClick={() => navigate("/donor")}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-2xl shadow-lg font-bold text-lg transition-transform transform hover:scale-105"
        >
          🙍‍♂️ My Profile
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
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

export default UserDashboard;
