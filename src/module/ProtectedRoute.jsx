// import { Navigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";
//
// const ProtectedRoute = ({ isAuthenticated, children }) => {
//     const location = useLocation();
//
//     useEffect(() => {
//         if (!isAuthenticated) {
//             window.location.replace("/login");
//         }
//     }, [isAuthenticated]);
//
//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//
//     return children;
// };
//
// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";

const checkAuth = () => {
    const token = localStorage.getItem("token");
    const tokenExpired = localStorage.getItem("token_expired");

    if (!token || !tokenExpired) return false;
    if (new Date().getTime() > Number(tokenExpired)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expired");
        return false;
    }

    return true;
};

const ProtectedRoute = ({ isAuthenticated, children }) => {
    const location = useLocation();
    const stillValid = checkAuth();

    // 만료된 경우 /login으로 리다이렉트
    if (!stillValid) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
