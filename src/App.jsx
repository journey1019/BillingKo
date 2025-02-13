import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import RootLayout from "@/components/layout/RootLayout.jsx";
import Homepage from "@/pages/Homepage.jsx";
import AccountPage from "@/pages/Account/AccountPage.jsx";
import DevicePage from "@/pages/Device/DevicePage.jsx";
import PricePage from "@/pages/Price/PricePage.jsx";
import Login from "@/pages/Login.jsx";
import Logout from "@/pages/Logout.jsx";
import SignUp from '@/pages/SignUp.jsx';
import AccountNewPage from '@/pages/Account/AccountNewPage.jsx';
import AccountEditPage from '@/pages/Account/AccountEditPage.jsx';
import PriceNewPage from '@/pages/Price/PriceNewPage.jsx';
import PriceEditPage from '@/pages/Price/PriceEditPage.jsx';
import DeviceNewPage from '@/pages/Device/DeviceNewPage.jsx';
import DeviceEditPage from '@/pages/Device/DeviceEditPage.jsx';
import FilePage from '@/pages/File/FilePage.jsx';
import CDRPage from '@/pages/File/CDRPage.jsx';
import MonthlyPage from '@/pages/Monthly/MonthlyPage.jsx';
import KOMonthlyPage from '@/pages/Monthly/KOMonthlyPage.jsx';
import AdjustmentPage from '@/pages/Adjustment/AdjustmentPage.jsx';
import AdjustmentNewPage from '@/pages/Adjustment/AdjustmentNewPage.jsx';
import AdjustmentEditPage from '@/pages/Adjustment/AdjustmentEditPage.jsx';
import CodePage from '@/pages/Adjustment/CodePage.jsx';

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

    console.log(`인증 성공 여부: ${isAuthenticated}`)

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
            <Route path="/signup" element={<SignUp/>} />

            {/* RootLayout 경로 */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RootLayout>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/file" element={<FilePage />} />
                                <Route path="/accounts" element={<AccountPage />} />
                                <Route path="/devices" element={<DevicePage />} />
                                <Route path="/price" element={<PricePage />} />
                                <Route path="/monthly" element={<MonthlyPage />} />
                                <Route path="/ko_monthly" element={<KOMonthlyPage />} />
                                <Route path="/adjustment" element={<AdjustmentPage />} />

                                <Route path="/file/cdr" element={<CDRPage />} />
                                <Route path="/file/accounts" element={<CDRPage />} />

                                <Route path="/accounts/new" element={<AccountNewPage />} />
                                <Route path="/accounts/:acct_num/edit" element={<AccountEditPage />} />

                                <Route path="/price/new" element={<PriceNewPage />} />
                                <Route path="/price/:ppid/edit" element={<PriceEditPage />} />

                                <Route path="/devices/new" element={<DeviceNewPage />} />
                                <Route path="/devices/:serial_number/edit" element={<DeviceEditPage />} />

                                <Route path="/adjustment/new" element={<AdjustmentNewPage />} />
                                <Route path="/adjustment/:adjustment_index/edit" element={<AdjustmentEditPage />} />
                                <Route path="/code/new" element={<CodePage />} />
                            </Routes>
                        </RootLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
