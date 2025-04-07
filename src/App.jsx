import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import ProtectedRoute from '@/module/ProtectedRoute.jsx';
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
import KOMonthlyPage from '@/pages/Monthly/koMonthly/KOMonthlyPage.jsx';
import AdjustmentPage from '@/pages/Adjustment/AdjustmentPage.jsx';
import AdjustmentNewPage from '@/pages/Adjustment/AdjustmentNewPage.jsx';
import AdjustmentEditPage from '@/pages/Adjustment/AdjustmentEditPage.jsx';
import CodePage from '@/pages/Adjustment/CodePage.jsx';
import KOMonthlyEditPage from '@/pages/Monthly/koMonthly/KOMonthlyEditPage.jsx';
import KOMonthlyAccountPage from '@/pages/Monthly/account/KOMonthlyAccountPage.jsx';
import KOMonthlyAccountSavePage from '@/pages/Monthly/account/KOMonthlyAccountSavePage.jsx';
import FontConvertPage from '@/pages/FontConvert/FontConvertPage.jsx';
import AccountMonthlyPage from '@/pages/Monthly/account/AccountMonthlyPage.jsx';
import UploadNewPage from '@/pages/File/UploadNewPage.jsx';
import UploadEditPage from '@/pages/File/UploadEditPage.jsx';
import CDRnNNPage from '@/pages/File/CDRnNNPage.jsx';
import PaymentPage from './pages/Payment/PaymentPage.jsx';
import EditPage from '@/pages/Account/EditPage.jsx';
import AdjustmentTransactionDetailEditForm from './components/form/Adjustment/AdjustmentTransactionDetailEditForm.jsx';

const checkAuth = () => {
    const token = localStorage.getItem("token");
    const tokenExpired = localStorage.getItem("token_expired");

    if (!token || !tokenExpired) return false;

    // 현재 시간이 토큰 만료 시간보다 크면 유효하지 않음
    if (new Date().getTime() > Number(tokenExpired)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expired");
        return false;
    }

    return true;
};

const App = () => {
    // 로그인 상태 확인
    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

    // 로그인 상태 변경 감지
    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(checkAuth());
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
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login setAuth={setIsAuthenticated} />}
            />

            {/* 회원가입 페이지 */}
            <Route path="/signup" element={<SignUp/>} />

            {/* Logout 페이지 */}
            <Route path="/logout" element={<Logout setAuth={setIsAuthenticated} />} />

            {/* 보호된 페이지: 인증되지 않으면 자동으로 /login 이동 */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <RootLayout>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/cdr_nn" element={<CDRnNNPage />} />
                                <Route path="/file" element={<FilePage />} />
                                <Route path="/accounts" element={<AccountPage />} />
                                <Route path="/devices" element={<DevicePage />} />
                                <Route path="/price" element={<PricePage />} />

                                <Route path="/monthly" element={<MonthlyPage />} /> {/* 계산관리 */}

                                <Route path="/adjustment" element={<AdjustmentPage />} />
                                <Route path="/ko_monthly/account" element={<KOMonthlyAccountPage />} />
                                <Route path="/ko_monthly" element={<KOMonthlyPage />} /> {/* 단말별 */}
                                <Route path="/ko_monthly_account" element={<AccountMonthlyPage />} /> {/* 고객별 */}
                                <Route path="/ko_monthly_result" element={<KOMonthlyAccountSavePage />} /> {/* 청구서 */}

                                <Route path="/font_convert" element={<FontConvertPage />} />

                                <Route path="/file/cdr" element={<CDRPage />} />
                                <Route path="/file/accounts" element={<CDRPage />} />

                                <Route path="/accounts/new" element={<AccountNewPage />} />
                                <Route path="/accounts/:acct_num/edit" element={<AccountEditPage />} />
                                <Route path="/accounts/edit/:acct_num" element={<EditPage />} />

                                <Route path="/price/new" element={<PriceNewPage />} />
                                <Route path="/price/:ppid/edit" element={<PriceEditPage />} />

                                <Route path="/devices/new" element={<DeviceNewPage />} />
                                <Route path="/devices/:serial_number/edit" element={<DeviceEditPage />} />

                                <Route path="/adjustment/new" element={<AdjustmentNewPage />} />
                                <Route path="/adjustment/:adjustment_index/edit" element={<AdjustmentEditPage />} />
                                <Route path="/code/new" element={<CodePage />} />

                                <Route path="/ko_monthly/edit" element={<KOMonthlyEditPage />} />

                                {/* File Upload Page */}
                                <Route path="/upload/new" element={<UploadNewPage />} />
                                <Route path="/upload/:sp_id/edit" element={<UploadEditPage />} />

                                <Route path="/payment" element={<PaymentPage />} />

                                <Route path="/adjustment/edit/:adjustment_index" element={<AdjustmentTransactionDetailEditForm/>} />
                            </Routes>
                        </RootLayout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default App;
