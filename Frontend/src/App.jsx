import React, { useEffect, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    const stableCheckAuth = useCallback(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        stableCheckAuth();
    }, [stableCheckAuth]);

    if (isCheckingAuth && !authUser)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );

    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;
