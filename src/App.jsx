import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import RootLayout from "@/components/layout/RootLayout.jsx";
import Homepage from "@/pages/Homepage.jsx";
import AccountPage from "@/pages/AccountPage.jsx";
import DevicePage from "@/pages/DevicePage.jsx";
import PricePage from "@/pages/PricePage.jsx";
import Login from "@/pages/Login.jsx";
import Logout from "@/pages/Logout.jsx";
import AccountNewPage from '@/pages/AccountNewPage.jsx';
import AccountEditPage from '@/pages/AccountEditPage.jsx';

// ProtectedRoute 컴포넌트
const ProtectedRoute = ({ isAuthenticated, children }) => {
    const location = useLocation();

    // 로그인되지 않은 상태에서 보호 경로에 접근 시 로그인 페이지로 이동
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

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

    // 페이지 로드 시 /login으로 리다이렉트
    useEffect(() => {
        if (!isAuthenticated && window.location.pathname !== "/login") {
            window.location.replace("/login");
        }
    }, [isAuthenticated]);

    console.log(isAuthenticated)

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
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RootLayout>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/accounts" element={<AccountPage />} />
                                <Route path="/device" element={<DevicePage />} />
                                <Route path="/price" element={<PricePage />} />

                                <Route path="/accounts/new" element={<AccountNewPage />} />
                                <Route path="/accounts/edit" element={<AccountEditPage />} />
                            </Routes>
                        </RootLayout>
                    </ProtectedRoute>
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
