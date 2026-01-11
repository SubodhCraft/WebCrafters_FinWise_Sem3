import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TrendingUp, Shield, ArrowRight } from "lucide-react";
import { saveSecurityQuestionsApi } from "/service/api";

export default function SecurityQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

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

    if (!selectedQuestions.question1) newErrors.question1 = "Please select a question";
    if (!selectedQuestions.question2) newErrors.question2 = "Please select a question";
    if (!selectedQuestions.question3) newErrors.question3 = "Please select a question";

    const questions = [
      selectedQuestions.question1,
      selectedQuestions.question2,
      selectedQuestions.question3,
    ];
    const uniqueQuestions = new Set(questions.filter((q) => q));
    if (uniqueQuestions.size < 3 && questions.filter((q) => q).length === 3) {
      newErrors.general = "Please select three different questions";
    }

    if (!answers.answer1.trim()) newErrors.answer1 = "Please provide an answer";
    if (!answers.answer2.trim()) newErrors.answer2 = "Please provide an answer";
    if (!answers.answer3.trim()) newErrors.answer3 = "Please provide an answer";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!userId) {
      toast.error("User ID not found. Please register again.");
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
        toast.success("Security questions saved successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Error saving security questions:", error);
      toast.error(error.response?.data?.message || "Failed to save security questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const confirm = window.confirm(
      "Are you sure you want to skip? You won't be able to recover your password without security questions."
    );
    if (confirm) {
      navigate("/login");
    }
  };

  const getAvailableQuestions = (currentKey) => {
    const selectedValues = Object.entries(selectedQuestions)
      .filter(([key, value]) => key !== currentKey && value)
      .map(([, value]) => value);

    return predefinedQuestions.filter((q) => !selectedValues.includes(q));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Security Questions</h2>
              <p className="text-purple-200 text-sm">Help us protect your account</p>
            </div>
          </div>

          <p className="text-purple-200 mb-6 text-center">
            These questions will help you recover your account if you forget your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center">
                {errors.general}
              </div>
            )}

            {/* Question 1 */}
            <div className="space-y-3">
              <label className="text-white font-semibold text-sm flex items-center gap-2">
                Security Question 1 <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedQuestions.question1}
                onChange={(e) => handleQuestionChange("question1", e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-purple-900">Select a question</option>
                {getAvailableQuestions("question1").map((question, index) => (
                  <option key={index} value={question} className="bg-purple-900">
                    {question}
                  </option>
                ))}
              </select>
              {errors.question1 && <span className="text-red-400 text-xs">{errors.question1}</span>}

              <input
                type="text"
                placeholder="Your answer"
                value={answers.answer1}
                onChange={(e) => handleAnswerChange("answer1", e.target.value)}
                disabled={!selectedQuestions.question1}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.answer1 && <span className="text-red-400 text-xs">{errors.answer1}</span>}
            </div>

            {/* Question 2 */}
            <div className="space-y-3">
              <label className="text-white font-semibold text-sm flex items-center gap-2">
                Security Question 2 <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedQuestions.question2}
                onChange={(e) => handleQuestionChange("question2", e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-purple-900">Select a question</option>
                {getAvailableQuestions("question2").map((question, index) => (
                  <option key={index} value={question} className="bg-purple-900">
                    {question}
                  </option>
                ))}
              </select>
              {errors.question2 && <span className="text-red-400 text-xs">{errors.question2}</span>}

              <input
                type="text"
                placeholder="Your answer"
                value={answers.answer2}
                onChange={(e) => handleAnswerChange("answer2", e.target.value)}
                disabled={!selectedQuestions.question2}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.answer2 && <span className="text-red-400 text-xs">{errors.answer2}</span>}
            </div>

            {/* Question 3 */}
            <div className="space-y-3">
              <label className="text-white font-semibold text-sm flex items-center gap-2">
                Security Question 3 <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedQuestions.question3}
                onChange={(e) => handleQuestionChange("question3", e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="" className="bg-purple-900">Select a question</option>
                {getAvailableQuestions("question3").map((question, index) => (
                  <option key={index} value={question} className="bg-purple-900">
                    {question}
                  </option>
                ))}
              </select>
              {errors.question3 && <span className="text-red-400 text-xs">{errors.question3}</span>}

              <input
                type="text"
                placeholder="Your answer"
                value={answers.answer3}
                onChange={(e) => handleAnswerChange("answer3", e.target.value)}
                disabled={!selectedQuestions.question3}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.answer3 && <span className="text-red-400 text-xs">{errors.answer3}</span>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 transition-all transform hover:-translate-y-1"
              >
                {loading ? "Saving..." : (
                  <>
                    Save & Continue
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}