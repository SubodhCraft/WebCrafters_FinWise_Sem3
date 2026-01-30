import React, { useState } from 'react';
import { TrendingUp, Shield, ArrowRight, Sun, Moon, Lock, Info, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { saveSecurityQuestionsApi } from "../../service/api";
import { useTheme } from "../context/ThemeContext.jsx";

export default function SecurityQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("pendingUserId");

  const predefinedQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
    "What is the name of your favorite teacher?",
    "What street did you grow up on?",
    "What is your favorite movie?",
    "What was the make of your first car?",
  ];

  const [selectedQuestions, setSelectedQuestions] = useState({
    question1: "",
    question2: "",
    question3: "",
  });

  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { isDarkMode: darkMode, toggleTheme } = useTheme();

  const handleQuestionChange = (questionKey, value) => {
    setSelectedQuestions((prev) => ({ ...prev, [questionKey]: value }));
    setErrors((prev) => ({ ...prev, [questionKey]: "" }));
  };

  const handleAnswerChange = (answerKey, value) => {
    setAnswers((prev) => ({ ...prev, [answerKey]: value }));
    setErrors((prev) => ({ ...prev, [answerKey]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedQuestions.question1) newErrors.question1 = "Selection required";
    if (!selectedQuestions.question2) newErrors.question2 = "Selection required";
    if (!selectedQuestions.question3) newErrors.question3 = "Selection required";

    const questions = [
      selectedQuestions.question1,
      selectedQuestions.question2,
      selectedQuestions.question3,
    ];
    const uniqueQuestions = new Set(questions.filter((q) => q));
    if (uniqueQuestions.size < 3 && questions.filter((q) => q).length === 3) {
      newErrors.general = "Please select unique questions.";
    }

    if (!answers.answer1.trim()) newErrors.answer1 = "Input required";
    if (!answers.answer2.trim()) newErrors.answer2 = "Input required";
    if (!answers.answer3.trim()) newErrors.answer3 = "Input required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!userId) {
      toast.error("User not found. Please register again.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId,
        questions: [
          { question: selectedQuestions.question1, answer: answers.answer1 },
          { question: selectedQuestions.question2, answer: answers.answer2 },
          { question: selectedQuestions.question3, answer: answers.answer3 },
        ],
      };

      const response = await saveSecurityQuestionsApi(payload);
      if (response.data.success) {
        toast.success("Security questions saved!");
        localStorage.removeItem("pendingUserId");
        setTimeout(() => navigate("/LoginPage"), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save security questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (window.confirm("Skip security questions? You won't be able to recover your account if you forget your password.")) {
      navigate("/LoginPage");
    }
  };

  const getAvailableQuestions = (currentKey) => {
    const selectedValues = Object.entries(selectedQuestions)
      .filter(([key, value]) => key !== currentKey && value)
      .map(([, value]) => value);
    return predefinedQuestions.filter((q) => !selectedValues.includes(q));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900'}`}>

      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-10 right-10 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl transition-all hover:scale-110 active:scale-95 shadow-2xl z-50"
      >
        {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-indigo-600" size={20} />}
      </button>

      <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-700">
        <div className={`backdrop-blur-3xl rounded-[4rem] p-16 border transition-all duration-500 ${darkMode ? 'bg-white/5 border-white/10 shadow-2xl shadow-black' : 'bg-white/70 border-white shadow-2xl shadow-purple-900/10'}`}>

          {/* Brand Identity */}
          <div className="flex items-center gap-5 mb-16">
            <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Account <span className="text-purple-600">Security</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2">Set up recovery questions</p>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-gray-500 font-medium text-lg leading-relaxed text-center italic">
              "Set up your security questions to help recover your account if you forget your password."
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {errors.general && (
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 animate-shake">
                <Info size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest">{errors.general}</p>
              </div>
            )}

            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Question {num}</label>
                  {errors[`question${num}`] && <span className="text-red-500 text-[8px] font-black uppercase tracking-widest">{errors[`question${num}`]}</span>}
                </div>
                <div className="relative group">
                  <select
                    value={selectedQuestions[`question${num}`]}
                    onChange={(e) => handleQuestionChange(`question${num}`, e.target.value)}
                    className={`w-full px-8 py-5 rounded-[2rem] border transition-all text-[11px] font-black uppercase tracking-tight focus:ring-4 focus:ring-purple-500/10 appearance-none cursor-pointer ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900 focus:bg-white'}`}
                  >
                    <option value="">Select a question</option>
                    {getAvailableQuestions(`question${num}`).map((q, i) => (
                      <option key={i} value={q} className="text-gray-900">{q}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="ANSWER..."
                  value={answers[`answer${num}`]}
                  onChange={(e) => handleAnswerChange(`answer${num}`, e.target.value)}
                  disabled={!selectedQuestions[`question${num}`]}
                  className={`w-full px-8 py-5 rounded-[2rem] border transition-all text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-purple-500/10 ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} disabled:opacity-30`}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-6 pt-10">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-2xl shadow-purple-500/40 hover:-translate-y-1 hover:shadow-purple-500/60 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? "Saving..." : <>Save Questions <ArrowRight size={18} /></>}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className={`flex-1 py-6 rounded-3xl font-black uppercase tracking-widest text-[9px] border transition-all ${darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-lg shadow-gray-200/50'}`}
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}