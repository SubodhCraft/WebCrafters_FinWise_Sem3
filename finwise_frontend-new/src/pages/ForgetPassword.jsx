import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TrendingUp, ArrowRight, ArrowLeft, ShieldCheck, Shield, Lock, Sun, Moon, Mail, Key } from "lucide-react";
import {
  getSecurityQuestionsApi,
  verifySecurityAnswersApi,
  resetPasswordApi,
} from "../../service/api";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Questions, 3: New Password
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isDarkMode: darkMode, toggleTheme } = useTheme();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email.trim()) {
      setErrors({ email: "Identifier required" });
      return;
    }
    setLoading(true);
    try {
      const response = await getSecurityQuestionsApi(email);
      if (response.data.success) {
        setQuestions(response.data.data.questions);
        setStep(2);
        toast.success("Security vector handshake complete");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Identifier rejection: User unknown");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswersSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (answers.some((answer) => !answer.trim())) {
      setErrors({ answers: "Protocol incomplete: All responses required" });
      return;
    }
    setLoading(true);
    try {
      const response = await verifySecurityAnswersApi({ email, answers });
      if (response.data.success) {
        setResetToken(response.data.data.resetToken);
        setStep(3);
        toast.success("Identity verified. Protocol unlocked.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification collision: Responses invalid");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!newPassword || !confirmPassword) {
      setErrors({ password: "Fields mandatory" });
      return;
    }
    if (newPassword.length < 6) {
      setErrors({ password: "Complexity failure: Min 6 chars" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ password: "Divergence: Credentials must match" });
      return;
    }
    setLoading(true);
    try {
      const response = await resetPasswordApi({ resetToken, newPassword });
      if (response.data.success) {
        toast.success("Credential reconfiguration complete");
        setTimeout(() => navigate("/LoginPage"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Protocol rejection during reset");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setErrors({});
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-700 ${darkMode ? 'bg-[#030612] text-white' : 'bg-[#f5f7ff] text-gray-900'}`}>

      {/* Indigo Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <div className={`absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full blur-[120px] ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/50'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full blur-[120px] ${darkMode ? 'bg-indigo-800/10' : 'bg-indigo-100/50'}`}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-10 right-10 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl transition-all hover:scale-110 active:scale-95 shadow-2xl z-50"
      >
        {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-indigo-600" size={20} />}
      </button>

      <div className="relative w-full max-w-xl animate-in fade-in zoom-in duration-700">
        <div className={`p-12 md:p-16 rounded-[4rem] transition-all duration-500 backdrop-blur-xl border ${darkMode ? 'bg-slate-900/40 border-white/10 shadow-2xl' : 'bg-white/80 border-indigo-100 shadow-2xl shadow-indigo-200/50'}`}>

          {/* Header */}
          <div className="flex items-center gap-5 mb-12">
            <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Key className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Access <span className="text-indigo-600">Recovery</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Credential Reconfiguration Protocol</p>
            </div>
          </div>

          {/* Phase Mapping */}
          <div className="flex items-center justify-between mb-16 px-4">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${step === num ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${step >= num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-200 dark:bg-white/5'}`}>
                    0{num}
                  </div>
                </div>
                {num < 3 && <div className={`flex-1 h-px bg-gray-200 dark:bg-white/10 mx-6 ${step > num ? 'bg-indigo-600' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="min-h-[300px] flex flex-col justify-center">
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-10">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Phase 01: Identification</h3>
                  <p className="text-gray-500 font-medium">Verify your primary identification vector to initiate recovery.</p>
                </div>

                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="SYSTEM IDENTIFIER (EMAIL)"
                    className={`w-full pl-16 pr-8 py-6 rounded-3xl border transition-all text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-purple-500/10 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'}`}
                  />
                </div>

                <div className="flex gap-6">
                  <button type="button" onClick={() => navigate('/LoginPage')} className={`flex-1 py-6 rounded-3xl font-black uppercase tracking-widest text-[9px] border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>Abort</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 hover:bg-indigo-700">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleAnswersSubmit} className="space-y-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Phase 02: Verification</h3>
                  <p className="text-gray-500 font-medium">Provide biometric-equivalent responses to clear security handshake.</p>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto px-2 custom-scrollbar">
                  {questions.map((q, i) => (
                    <div key={i} className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{q}</label>
                      <input
                        type="text"
                        value={answers[i]}
                        onChange={(e) => handleAnswerChange(i, e.target.value)}
                        placeholder="INPUT RESPONSE..."
                        className={`w-full px-8 py-5 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 focus:bg-white'}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 pt-6">
                  <button type="button" onClick={() => setStep(1)} className={`flex-1 py-6 rounded-3xl font-black uppercase tracking-widest text-[9px] border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>Step-Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 hover:bg-indigo-700">
                    Verify Identity <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="space-y-10">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Phase 03: Reconfiguration</h3>
                  <p className="text-gray-500 font-medium">Establish a new high-complexity protocol for system access.</p>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="NEW PROTOCOL"
                      className={`w-full pl-16 pr-8 py-6 rounded-3xl border transition-all text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 focus:bg-white'}`}
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="CONFIRM PROTOCOL"
                      className={`w-full pl-16 pr-8 py-6 rounded-3xl border transition-all text-[10px] font-black uppercase tracking-widest ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 focus:bg-white'}`}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-6 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-3 hover:bg-indigo-700">
                  Commit Reconfiguration <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}