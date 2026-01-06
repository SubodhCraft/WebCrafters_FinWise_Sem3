import React, { useState } from "react";
import { Eye, EyeOff, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createUserApi } from "/service/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await createUserApi(payload);

      toast.success(response.data.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server error. Check backend is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4">
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">FinWise</span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-purple-200 mb-8">Join us and take control of your finances today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="username" placeholder="Username" required minLength={3}
              value={formData.username} onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300" />

            <input type="email" name="email" placeholder="Email" required
              value={formData.email} onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300" />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" required minLength={6}
                value={formData.password} onChange={handleChange}
                className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300">
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <div className="relative">
              <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" required minLength={6}
                value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300">
                {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3">
              {loading ? "Creating Account..." : <>Sign Up <ArrowRight size={22} /></>}
            </button>

            <p className="text-center text-purple-200 text-sm mt-8">
              Already have an account? <a href="/login" className="text-white font-semibold hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}