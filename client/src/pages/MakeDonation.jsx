import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MakeDonation = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: "",
    quantity: "",
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("http://localhost:8800/resource");
        setResources(res.data);
      } catch (err) {
        console.error("Failed to load resources", err);
      }
    };
    fetchResources();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/donation", {
        Donor_ID: userId,
        Resource_ID: form.resourceId,
        Quantity: form.quantity,
      });
      alert("Donation successful!");
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Donation failed", err);
      alert("Donation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform hover:scale-105 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🎁 Make a Donation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Resource</label>
            <select
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">-- Select Resource --</option>
              {resources.map((r) => (
                <option key={r.Resource_ID} value={r.Resource_ID}>
                  {r.Resource_Type} ({r.Unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            💖 Donate Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeDonation;
