import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    skill: "",
    address: "",
    isAnonymous: false,
    role: "donor",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = "";
      const payload = { ...inputs };

      if (inputs.role === "volunteer") {
        url = "http://localhost:8800/register/volunteer";
      } else {
        url = "http://localhost:8800/register/donor";
      }

      await axios.post(url, payload);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + (err.response?.data || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white flex flex-col justify-center px-10 md:px-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
          Join the <span className="text-blue-400">Disaster Relief</span>{" "}
          <br /> <span className="text-purple-400">Management System</span>
        </h1>
        <p className="text-lg text-gray-300 mb-6 max-w-lg">
          Be a volunteer or donor and make a real impact in disaster relief
          operations. Register now and be part of a secure, reliable, and fast
          response network.
        </p>
        <p className="text-sm font-medium text-blue-400">
          • Empower • Respond • Support
        </p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
              <span className="text-white text-2xl">✍️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 text-center">
              Register to access your DRMS dashboard
            </p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-center py-2 px-4 rounded mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="contact"
              placeholder="Contact Info"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              name="role"
              value={inputs.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
            </select>

            {inputs.role === "volunteer" && (
              <input
                name="skill"
                placeholder="Skill (e.g., swimming, first-aid)"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            {inputs.role === "donor" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="isAnonymous"
                  className="text-gray-700 font-medium"
                >
                  Register as Anonymous Donor
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:from-purple-600 hover:to-blue-500 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
