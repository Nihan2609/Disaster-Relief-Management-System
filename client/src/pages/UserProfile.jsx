import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/donor/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8800/donor/${userId}`, {
        Name: user.Name,
        Contact_Info: user.Contact_Info,
        Is_Anonymous: user.Is_Anonymous
      });
      alert("Profile updated!");
      setEdit(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Profile update failed");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-white bg-gradient-to-br from-purple-500 to-blue-600">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          🙍‍♂️ My Profile
        </h2>

        {edit ? (
          <div className="space-y-4">
            <input
              name="Name"
              value={user.Name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Full Name"
            />
            <input
              name="Contact_Info"
              value={user.Contact_Info}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="Contact Info"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={user.Is_Anonymous}
                onChange={() =>
                  setUser((prev) => ({ ...prev, Is_Anonymous: !prev.Is_Anonymous }))
                }
                className="w-5 h-5 accent-purple-500"
              />
              Donate Anonymously
            </label>
            <button
              onClick={handleUpdate}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              💾 Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-gray-800">
            <p>
              <strong>Name:</strong> {user.Name}
            </p>
            <p>
              <strong>Contact:</strong> {user.Contact_Info}
            </p>
            <p>
              <strong>Anonymous:</strong> {user.Is_Anonymous ? "Yes" : "No"}
            </p>
            <button
              onClick={() => setEdit(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            >
              ✏️ Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
