import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8800/login", inputs);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userRole", res.data.role);

      if (res.data.role === "admin") navigate("/admin/home");
      else if (res.data.role === "volunteer") navigate("/volunteer/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white flex flex-col justify-center px-10 md:px-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
          Disaster Relief <br />
          <span className="text-blue-400">Management</span>{" "}
          <span className="text-purple-400">System</span>
        </h1>
        <p className="text-lg text-gray-300 mb-6 max-w-lg">
          Coordinating emergency response efforts with precision and efficiency.
          Your gateway to making a difference when it matters most.
        </p>
        <p className="text-sm font-medium text-blue-400">
          • Secure • Reliable • Fast
        </p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center">
              Sign in to access your DRMS dashboard
            </p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-center py-2 px-4 rounded mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={inputs.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={inputs.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:from-purple-600 hover:to-blue-500 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
