import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/Registration.jsx';
import ForgotPasswordPage from './pages/ForgetPassword.jsx';
import SecurityQuestions from './pages/SecurityQuestions.jsx';
// import AdminDashboard from './pages/AdminDashboard.jsx';
// import EditUsers from './pages/Edit.jsx';
// import HomePage from './pages/HomePage.jsx';
import { Toaster } from 'react-hot-toast';

function App(){
  return(
    <Router>
      <Toaster />
      {/* <Headers /> */}
      <Routes>
        {/* <Route path ="/" element ={<Home/>}/> */}
        <Route path ="/LoginPage" element ={<LoginPage/>}/>
        <Route path ="/register" element ={<RegisterPage/>}/>
        <Route path="/security-questions" element={<SecurityQuestions />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="*" element={<Navigate to="/LoginPage" replace />} />
        {/* <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/editusers/:id" element={<EditUsers/>} /> */}
      </Routes>
      {/* <Footers /> */}
    </Router>
  )
}

export default App