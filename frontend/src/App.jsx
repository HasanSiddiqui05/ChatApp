import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import EmailInput from "./components/EmailInput";
import OtpInput from "./components/OtpInput";
import DetailsInput from "./components/DeatilsInput";
import { useAuth } from "./context/AuthContext";
import { RiLoader5Line } from "react-icons/ri";

const PublicRoute = ({ children }) => {
  const { AuthState } = useAuth();
  return AuthState.isLoggedIn ? <Navigate to="/home" /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { AuthState } = useAuth();
  return AuthState.isLoggedIn ? children : <Navigate to="/signup" />;
};

const App = () => {
  const { AuthState, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center px-4">
        <RiLoader5Line className="animate-spin" size={25} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route - redirect based on login */}
        <Route path="/" element={ AuthState.isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/signup" /> }/>

        {/* Public routes */}
        <Route path="/signup" element={
            <PublicRoute>
              <EmailInput />
            </PublicRoute>
          }
        />
        <Route path="/verifyOtp" element={
            <PublicRoute>
              <OtpInput />
            </PublicRoute>
          }
        />
        <Route path="/completeProfile" element={<DetailsInput />} />
        {/* Protected homepage */}
        <Route path="/home/*" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
