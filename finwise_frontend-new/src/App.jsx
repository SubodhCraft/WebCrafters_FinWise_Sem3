// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import LoginPage from './pages/LoginPage.jsx';
// import RegisterPage from './pages/Registration.jsx';
// import ForgotPasswordPage from './pages/ForgetPassword.jsx';
// import SecurityQuestions from './pages/SecurityQuestions.jsx';
// import Dashboard from './components/Dashboard/Dashboard.jsx';
// // import Home from './pages/Home.jsx';
// import Header from './components/Layout/Header.jsx';
// import Sidebar from './components/Layout/Sidebar.jsx';
// // import Footers from './components/Footers.jsx';
// // import AdminDashboard from './pages/AdminDashboard.jsx';
// // import EditUsers from './pages/Edit.jsx';
// // import HomePage from './pages/HomePage.jsx';
// import { Toaster } from 'react-hot-toast';

// function App(){

//   const isAuthenticated = () => {
//   return !!localStorage.getItem("token");
// };

//   return(
//     <Router>
//       <Toaster />
//       {/* <Headers /> */}
//       <Routes>
//         {/* <Route path ="/" element ={<Home/>}/> */}
//         {/* <Route path ="/LoginPage" element ={<LoginPage/>}/> */}

//         <Route path="/LoginPage" element={ isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />}/>

//         <Route path ="/register" element ={<RegisterPage/>}/>
//         <Route path="/security-questions" element={<SecurityQuestions />} />
//         <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
//         {/* <Route path="/dashboard" element={<Dashboard />} /> */}
//         <Route path="/dashboard" element={
//             isAuthenticated() ? <Dashboard /> : <Navigate to="/LoginPage" replace />
//           }/>

//         <Route path="*" element={<Navigate to="/LoginPage" replace />} />
//         {/* <Route path="/admindashboard" element={<AdminDashboard/>} />
//         <Route path="/editusers/:id" element={<EditUsers/>} /> */}
//       </Routes>
//       {/* <Footers /> */}
//     </Router>
//   )
// }

// export default App















































// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import LoginPage from "./pages/LoginPage.jsx";
// import RegisterPage from "./pages/Registration.jsx";
// import ForgotPasswordPage from "./pages/ForgetPassword.jsx";
// import SecurityQuestions from "./pages/SecurityQuestions.jsx";
// import Dashboard from "./components/Dashboard/Dashboard.jsx";
// import SelfNotes from "./pages/SelfNotes.jsx";

// // Auth helper
// const isAuthenticated = () => {
//   return !!localStorage.getItem("token");
// };

// function App() {
//   return (
//     <Router>
//       <Toaster position="top-right" />

//       <Routes>
//         {/* Login */}
//         <Route path="/LoginPage" element={
//             isAuthenticated() ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <LoginPage />
//             )} />

//         {/* Register */}
//         <Route path="/register" element={
//             isAuthenticated() ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <RegisterPage />
//             )} />

//         {/* Forgot password */}
//         <Route
//           path="/forgotpassword"
//           element={
//             isAuthenticated() ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <ForgotPasswordPage />
//             )
//           }
//         />

//         {/* Security Questions */}
//         <Route
//           path="/security-questions"
//           element={
//             isAuthenticated() ? (
//               <Navigate to="/dashboard" replace />
//             ) : (
//               <SecurityQuestions />
//             )
//           }
//         />

//         {/* Dashboard (Protected) */}
//         <Route
//           path="/dashboard"
//           element={
//             isAuthenticated() ? (
//               <Dashboard />
//             ) : (
//               <Navigate to="/LoginPage" replace />
//             )
//           }
//         />

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/LoginPage" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



















import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CurrencyProvider } from "./context/CurrencyContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

/* ================= PAGES ================= */
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/Registration.jsx";
import ForgotPasswordPage from "./pages/ForgetPassword.jsx";
import SecurityQuestions from "./pages/SecurityQuestions.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import SelfNotes from "./pages/SelfNotes.jsx";
import Setting from "./pages/Setting.jsx";
import Calander from "./pages/Calander.jsx";
import Goal from "./pages/Goal.jsx";
import Analytics from "./pages/Analytics.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Notifications from "./pages/Notifications.jsx";

/* ================= AUTH HELPERS ================= */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* ================= PROTECTED ROUTE ================= */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/LoginPage" replace />;
  }
  return children;
};

/* ================= PUBLIC ROUTE (OPTIONAL BUT CLEAN) ================= */
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

/* ================= ADMIN ROUTE ================= */
const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/LoginPage" replace />;
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === 'admin') {
      return children;
    }
  } catch (error) {
    console.error("Auth error:", error);
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Toaster position="top-right" />

          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route
              path="/LoginPage"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            <Route
              path="/forgotpassword"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />

            <Route
              path="/security-questions"
              element={
                <PublicRoute>
                  <SecurityQuestions />
                </PublicRoute>
              }
            />

            {/* ========== PROTECTED ROUTES ========== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/selfnotes"
              element={
                <ProtectedRoute>
                  <SelfNotes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Setting />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navigate to="/settings" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calander />
                </ProtectedRoute>
              }
            />

            <Route
              path="/goals"
              element={
                <ProtectedRoute>
                  <Goal />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* ========== DEFAULT ROUTES ========== */}
            <Route
              path="/"
              element={
                isAuthenticated() ? (
                  (() => {
                    try {
                      const user = JSON.parse(localStorage.getItem("user") || "{}");
                      return user.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
                    } catch (e) {
                      return <Navigate to="/dashboard" replace />;
                    }
                  })()
                ) : (
                  <LandingPage />
                )
              }
            />

            {/* ========== 404 FALLBACK ========== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;

