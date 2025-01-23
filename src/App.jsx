import { Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "@/components/layout/RootLayout.jsx";
import Homepage from "@/pages/Homepage.jsx";
import AccountPage from "@/pages/AccountPage.jsx";
import DevicePage from "@/pages/DevicePage.jsx";
import PricePage from "@/pages/PricePage.jsx";
import Login from "@/pages/Login.jsx";

const App = () => {
    // 로그인 상태 확인
    const isAuthenticated = !!localStorage.getItem("token"); // 예: token으로 로그인 상태 관리

    return (
        <Routes>
            {/* Login 페이지 */}
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/" /> : <Login />
                }
            />

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
