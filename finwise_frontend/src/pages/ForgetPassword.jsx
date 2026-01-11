// import React, { useState } from "react";
// import { ArrowRight } from "lucide-react";
// import { forgotPasswordApi } from "service/api";

// export default function ForgotPasswordPage() {
//   const [formData, setFormData] = useState({
//     email: "",
//     answer1: "",
//     answer2: "",
//     newPassword: "",
//   });

//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await forgotPasswordApi(formData);
//       setSuccess(res.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || "Reset failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4">
//       <form onSubmit={handleSubmit} className="bg-white/5 p-10 rounded-3xl w-full max-w-md space-y-4">

//         <h2 className="text-3xl font-bold text-white">Reset Password</h2>

//         <input name="email" placeholder="Email" onChange={handleChange} className="input" />
//         <input name="answer1" placeholder="Answer 1" onChange={handleChange} className="input" />
//         <input name="answer2" placeholder="Answer 2" onChange={handleChange} className="input" />
//         <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} className="input" />

//         {error && <p className="text-red-400">{error}</p>}
//         {success && <p className="text-green-400">{success}</p>}

//         <button type="submit" className="btn">
//           Reset Password <ArrowRight />
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TrendingUp, ArrowRight, ArrowLeft, Shield, Lock } from "lucide-react";
import {
  getSecurityQuestionsApi,
  verifySecurityAnswersApi,
  resetPasswordApi,
} from "/service/api";

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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    setLoading(true);

    try {
      const response = await getSecurityQuestionsApi(email);

      if (response.data.success) {
        setQuestions(response.data.data.questions);
        setStep(2);
        toast.success("Security questions retrieved!");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error(
        error.response?.data?.message ||
          "User not found or no security questions set"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswersSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (answers.some((answer) => !answer.trim())) {
      setErrors({ answers: "All answers are required" });
      return;
    }

    setLoading(true);

    try {
      const response = await verifySecurityAnswersApi({ email, answers });

      if (response.data.success) {
        setResetToken(response.data.data.resetToken);
        setStep(3);
        toast.success("Answers verified!");
      }
    } catch (error) {
      console.error("Error verifying answers:", error);
      toast.error(
        error.response?.data?.message ||
          "Incorrect answers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!newPassword || !confirmPassword) {
      setErrors({ password: "Both fields are required" });
      return;
    }

    if (newPassword.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      const response = await resetPasswordApi({ resetToken, newPassword });

      if (response.data.success) {
        toast.success(
          "Password reset successful! Redirecting to login..."
        );
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Reset Password</h2>
              <p className="text-purple-200 text-sm">Recover your account</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 1
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  : "bg-white/10 text-purple-300"
              }`}
            >
              1
            </div>
            <div className="w-12 h-0.5 bg-white/20"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 2
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  : "bg-white/10 text-purple-300"
              }`}
            >
              2
            </div>
            <div className="w-12 h-0.5 bg-white/20"></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 3
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                  : "bg-white/10 text-purple-300"
              }`}
            >
              3
            </div>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <p className="text-purple-200 text-center mb-6 text-sm">
                Enter your email address to retrieve your security questions
              </p>

              <div>
                <label className="text-white font-semibold text-sm block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
                {errors.email && (
                  <span className="text-red-400 text-xs mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 transition-all transform hover:-translate-y-1"
              >
                {loading ? "Checking..." : (
                  <>
                    Continue
                    <ArrowRight size={22} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={22} />
                Back to Login
              </button>
            </form>
          )}

          {/* Step 2: Security Questions */}
          {step === 2 && (
            <form onSubmit={handleAnswersSubmit} className="space-y-5">
              <p className="text-purple-200 text-center mb-6 text-sm">
                Answer your security questions to verify your identity
              </p>

              {errors.answers && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center">
                  {errors.answers}
                </div>
              )}

              {questions.map((question, index) => (
                <div key={index}>
                  <label className="text-white font-semibold text-sm block mb-2">
                    {question}
                  </label>
                  <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Your answer"
                    className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 transition-all transform hover:-translate-y-1"
              >
                {loading ? "Verifying..." : (
                  <>
                    Verify Answers
                    <ArrowRight size={22} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={22} />
                Back
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <p className="text-purple-200 text-center mb-6 text-sm">
                Create a new password for your account
              </p>

              {errors.password && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center">
                  {errors.password}
                </div>
              )}

              <div>
                <label className="text-white font-semibold text-sm block mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="text-white font-semibold text-sm block mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/30 disabled:opacity-70 transition-all transform hover:-translate-y-1"
              >
                {loading ? "Resetting..." : (
                  <>
                    Reset Password
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}