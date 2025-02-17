import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ isAuthenticated, children }) => {
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            window.location.replace("/login");
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
