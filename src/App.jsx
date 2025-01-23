import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RootLayout from "@/components/layout/RootLayout.jsx";
import Homepage from "@/pages/Homepage.jsx";
import AccountPage from "@/pages/AccountPage.jsx";
import DevicePage from "@/pages/DevicePage.jsx";
import PricePage from "@/pages/PricePage.jsx";
import Login from "@/pages/Login.jsx";
import Logout from "@/pages/Logout.jsx";

const App = () => {
    // 로그인 상태 확인
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    // 로그인 상태 변경 감지
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <Routes>
            {/* Login 페이지 */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />
                }
            />

            {/* Logout 페이지 */}
            <Route path="/logout" element={<Logout setAuth={setIsAuthenticated} />} />

            {/* RootLayout 경로 */}
            <Route
                path="/*"
                element={
                    isAuthenticated ? (
                        <RootLayout>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/account" element={<AccountPage />} />
                                <Route path="/device" element={<DevicePage />} />
                                <Route path="/price" element={<PricePage />} />
                            </Routes>
                        </RootLayout>
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>

        // <RootLayout>
        //     <Routes>
        //         <Route path="/" element={<Homepage />} /> {/* 기본 경로 */}
        //         <Route path="/account" element={<AccountPage />} />
        //         <Route path="/device" element={<DevicePage />} />
        //         <Route path="/price" element={<PricePage />} />
        //     </Routes>
        // </RootLayout>
    );
};

export default App;
