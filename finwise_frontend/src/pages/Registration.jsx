import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Sun, Moon, Lock, Mail, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createUserApi } from "../../service/api";
import { useTheme } from "../context/ThemeContext.jsx";
import logo from "../assets/logo-finwise.png";

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
  const { isDarkMode: darkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (formData.password.length < 6) {
      return toast.error("Password is too short. Use at least 6 characters.");
    }

    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await createUserApi(payload);
      const userId = response?.data?.userId;

      if (!userId) {
        toast.error("Account creation failed. Please try again.");
        return;
      }

      localStorage.setItem("pendingUserId", userId);
      toast.success("Account created! Setting up your security questions.");

      setTimeout(() => {
        navigate("/security-questions", {
          state: { userId }
        });
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-700 ${darkMode ? 'bg-[#030612] text-white' : 'bg-[#f5f7ff] text-gray-900'}`}>

      {/* Indigo Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <div className={`absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full blur-[120px] ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/50'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[120px] ${darkMode ? 'bg-indigo-800/10' : 'bg-indigo-100/50'}`}></div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:rotate-6">
            <img src={logo} alt="FinWise" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">FinWise</span>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-black/5 border-black/5 text-gray-500 hover:text-black'}`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>

      <div className="relative w-full max-w-xl z-10 pt-20">
        <div className={`p-12 md:p-16 rounded-[2.5rem] transition-all duration-500 backdrop-blur-xl ${darkMode ? 'bg-slate-900/40 border border-white/10 shadow-2xl' : 'bg-white/80 border border-indigo-100 shadow-2xl shadow-indigo-200/50'}`}>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Create your account</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Join FinWise to start managing your daily finances with ease.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Full Name / Username</label>
                <div className="relative group">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-black'}`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="John Doe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={`w-full pl-13 pr-5 py-4 rounded-2xl border transition-all text-sm outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Email Address</label>
                <div className="relative group">
                  <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-black'}`}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full pl-13 pr-5 py-4 rounded-2xl border transition-all text-sm outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Password</label>
                  <div className="relative group">
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-black'}`}>
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-13 pr-11 py-4 rounded-2xl border transition-all text-sm outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Confirm</label>
                  <div className="relative group">
                    <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 group-focus-within:text-white' : 'text-gray-400 group-focus-within:text-black'}`}>
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full pl-13 pr-11 py-4 rounded-2xl border transition-all text-sm outline-hidden ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700 focus:border-white/20 focus:ring-4 focus:ring-white/5' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-gray-600 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 mt-4 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-500/20`}
            >
              {loading ? "Registering..." : <>Get Started <ArrowRight size={18} /></>}
            </button>

            <div className="pt-6 border-t border-gray-100 dark:border-white/5 text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/LoginPage')}
                  className={`font-bold transition-colors ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}